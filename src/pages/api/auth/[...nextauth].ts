import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../server/db/client";
import type { User } from "next-auth";
const bcrypt = require("bcrypt");

const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/",
        error: "/",
    },
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "Text",
                    placeholder: "username...",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (credentials === undefined) return null;
                const { username, password } = credentials;
                const user = await prisma.user.findUnique({
                    where: { username },
                });
                if (!user) return null;
                const userMatchesPassword = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!userMatchesPassword) return null;
                return { name: username } as User;
            },
        }),
    ],
    secret: process.env.JWT_SECRET,
};

export default NextAuth(authOptions);
