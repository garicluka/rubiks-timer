import { procedure, router } from "../trpc";
import { z } from "zod";
import { prisma } from "../db/client";

export const solveRouter = router({
    add: procedure
        .input(
            z.object({
                roomId: z.string(),
                scramble: z.string(),
                time: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { session } = ctx;
            if (!session?.user?.name)
                throw new Error("something went wrong with session");
            const currentUser = await prisma.user.findUnique({
                where: { username: session.user.name },
            });
            const roomExists = await prisma.room.findUnique({
                where: { id: input.roomId },
            });
            if (!roomExists)
                throw new Error(
                    "room dont exists or smoething else ewent wrong"
                );
            const createdSolve = await prisma.solve.create({
                data: {
                    roomId: roomExists.id,
                    scramble: input.scramble,
                    time: input.time,
                },
            });
            return { message: "added solve" };
        }),
    delete: procedure.input(z.string()).mutation(async ({ input, ctx }) => {
        const { session } = ctx;
        if (!session?.user?.name) throw new Error("session error!");
        const currentUser = await prisma.user.findUnique({
            where: { username: session.user.name },
        });
        if (!currentUser) throw new Error("finding new user error!");
        const deletedSolve = await prisma.solve.delete({
            where: { id: input },
        });
        if (!deletedSolve)
            throw new Error("something went wrong with deleting solve");
        return { message: "deleted solve" };
    }),
    update: procedure
        .input(
            z.object({
                solveId: z.string(),
                newComment: z.string(),
                newPlusTwo: z.boolean(),
                newDnf: z.boolean(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { session } = ctx;
            if (!session?.user?.name) throw new Error("session Error!");
            const currentUser = await prisma.user.findUnique({
                where: { username: session.user.name },
            });
            if (!currentUser) throw new Error("finding current user Error!");
            const updatedSolve = await prisma.solve.update({
                where: {
                    id: input.solveId,
                },
                data: {
                    comment: input.newComment,
                    plusTwo: input.newPlusTwo,
                    dnf: input.newDnf,
                },
            });
            return { message: "updated solve!" };
        }),
});
