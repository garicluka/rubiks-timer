import "@/styles/globals.css";
import { trpc } from "../utils/trpc";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";

function App({
    Component,
    pageProps,
    session,
}: AppProps & { session: Session }) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}

export default trpc.withTRPC(App);
