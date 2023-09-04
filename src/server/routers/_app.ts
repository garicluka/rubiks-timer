import { router } from "../trpc";
import { authRouter } from "./auth";
import { roomRouter } from "./room";
import { solveRouter } from "./solve";

export const appRouter = router({
    auth: authRouter,
    solve: solveRouter,
    room: roomRouter,
});

export type AppRouter = typeof appRouter;
