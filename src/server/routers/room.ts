import { procedure, router } from "../trpc";
import { z } from "zod";
import { prisma } from "../db/client";
import {
    singleLastBest,
    ao5LastBest,
    ao12LastBest,
    ao100LastBest,
    mean,
    betterThanLast,
} from "../..//utils/logic";

export const roomRouter = router({
    create: procedure
        .input(
            z.object({
                name: z.string().min(1).max(10),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { session } = ctx;
            if (!session) throw new Error("no session(no user is signed in)!");
            if (!session.user)
                throw new Error("something went wrong with session");
            if (!session.user.name)
                throw new Error("somethng went wrong with session");
            const currentUser = await prisma.user.findUnique({
                where: {
                    username: session.user.name,
                },
            });
            if (!currentUser)
                throw new Error(
                    "something went wrong with finding current user!"
                );
            const roomExists = await prisma.room.findMany({
                where: {
                    userId: currentUser.id,
                    name: input.name,
                },
            });
            if (roomExists.length > 0) throw new Error("room already exists!");
            const disconnectUser = await prisma.user.update({
                where: {
                    id: currentUser.id,
                },
                data: {
                    selectedRoom: {
                        disconnect: true,
                    },
                },
            });
            const createdRoom = await prisma.room.create({
                data: {
                    name: input.name,
                    userId: currentUser.id,
                    selectedById: disconnectUser.id,
                },
            });
            return { message: "created room!" };
        }),
    delete: procedure.input(z.string()).mutation(async ({ input, ctx }) => {
        const { session } = ctx;
        if (!session) throw new Error("something went wrong with session");
        if (!session.user) throw new Error("something went wrong with session");
        if (!session.user.name)
            throw new Error("something went wrong with session");
        const currentUser = await prisma.user.findUnique({
            where: { username: session.user.name },
            select: {
                id: true,
                selectedRoom: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (!currentUser)
            throw new Error("something went wrong with getting current user");
        if (!currentUser.selectedRoom)
            throw new Error("something went wrong with getting current ");
        const roomSize = await prisma.room.findMany({
            where: { userId: currentUser.id },
        });
        if (roomSize.length < 2)
            throw new Error("there is less then 2 rooms already");
        if (currentUser.selectedRoom.id != input)
            throw new Error("you didnt delete selected room");
        const disconnectRoom = await prisma.room.update({
            where: {
                id: currentUser.selectedRoom.id,
            },
            data: {
                selectedBy: {
                    disconnect: true,
                },
            },
        });
        const deleteRoomSolves = await prisma.solve.deleteMany({
            where: {
                roomId: disconnectRoom.id,
            },
        });
        const deletedRoom = await prisma.room.delete({
            where: {
                id: disconnectRoom.id,
            },
        });
        if (!deletedRoom)
            throw new Error("something went wrong with deleting room!");
        const lastRoom = await prisma.room.findMany({
            where: {
                userId: currentUser.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const connectLastRoom = await prisma.room.update({
            where: {
                id: lastRoom[0].id,
            },
            data: {
                selectedById: currentUser.id,
            },
        });
        return { message: "deleted room!" };
    }),
    select: procedure.input(z.string()).mutation(async ({ input, ctx }) => {
        const { session } = ctx;
        if (!session?.user?.name) throw new Error("session error!");
        const currentUser = await prisma.user.findUnique({
            where: {
                username: session.user.name,
            },
        });
        if (!currentUser) throw new Error("current user error!");
        const roomExists = await prisma.room.findUnique({
            where: {
                id: input,
            },
        });
        if (!roomExists)
            throw new Error("there is no room you want to select!");
        const disconnectUser = await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                selectedRoom: {
                    disconnect: true,
                },
            },
        });
        const connectRoom = await prisma.room.update({
            where: {
                id: roomExists.id,
            },
            data: {
                selectedById: currentUser.id,
            },
        });
        return { message: "conneced to room" };
    }),
    getAll: procedure.query(async ({ ctx }) => {
        const { session } = ctx;
        if (!session?.user?.name)
            throw new Error("something went wrong wtih getting session");
        const currentUser = await prisma.user.findUnique({
            where: { username: session.user.name },
        });
        if (!currentUser)
            throw new Error("something went wrong with getting current user");
        const allRooms = await prisma.room.findMany({
            where: {
                userId: currentUser.id,
            },
            select: {
                name: true,
                id: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return { rooms: allRooms };
    }),
    // for some reason createdAt in solves is converted frmo Date to string type
    getCurrent: procedure.query(async ({ ctx }) => {
        const { session } = ctx;
        if (!session?.user?.name)
            throw new Error("something went wrong with getting session!");
        const currentUser = await prisma.user.findUnique({
            where: {
                username: session.user.name,
            },
            select: {
                selectedRoom: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (!currentUser?.selectedRoom)
            throw new Error("something went wrong with getting current user!");
        const roomSolves = await prisma.room.findUnique({
            where: {
                id: currentUser.selectedRoom.id,
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                solves: {
                    select: {
                        id: true,
                        scramble: true,
                        time: true,
                        createdAt: true,
                        plusTwo: true,
                        dnf: true,
                        comment: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        if (!roomSolves)
            throw new Error("something went wrong with getting room sovles");

        let latestSolveTime = "0.00";
        if (roomSolves.solves.length > 0) {
            latestSolveTime = roomSolves.solves[0].time;
        }
        const solves = roomSolves.solves.map((s) =>
            s.dnf ? "dnf" : s.plusTwo ? (Number(s.time) + 2).toFixed(2) : s.time
        );
        const singleBestLatest = singleLastBest(solves);
        const ao5BestLatest = ao5LastBest(solves);
        const ao12BestLatest = ao12LastBest(solves);
        const ao100BestLatest = ao100LastBest(solves);
        const betterThan = betterThanLast(solves);
        const meanVal = mean(solves);

        return {
            solves: roomSolves.solves,
            latestSolveTime,
            singleBestLatest,
            ao5BestLatest,
            ao12BestLatest,
            ao100BestLatest,
            betterThan,
            mean: meanVal,
            id: roomSolves.id,
            name: roomSolves.name,
            createdAt: roomSolves.createdAt,
        };
    }),
});
