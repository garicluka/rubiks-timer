import { z } from "zod";
import { procedure, router } from "../trpc";
import { prisma } from "../db/client";

const bcrypt = require("bcrypt");

export const authRouter = router({
    register: procedure
        .input(
            z.object({
                username: z.string().min(4).max(15),
                password: z.string().min(8).max(50),
            })
        )
        .mutation(async ({ input }) => {
            const userExists = await prisma.user.findUnique({
                where: {
                    username: input.username,
                },
            });
            if (userExists) throw new Error("User Already Exists!");
            const hash: string = await bcrypt.hash(input.password, 10);
            const newUser = await prisma.user.create({
                data: {
                    username: input.username,
                    password: hash,
                },
            });
            const createdRoom = await prisma.room.create({
                data: {
                    name: "room #1",
                    userId: newUser.id,
                },
            });
            const selectRoom = await prisma.room.update({
                where: {
                    id: createdRoom.id,
                },
                data: {
                    selectedById: newUser.id,
                },
            });
            return { message: "Registered New User!" };
        }),
});
