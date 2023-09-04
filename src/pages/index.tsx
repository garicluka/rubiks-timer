import type { NextPage } from "next";
import type { Solve } from "../utils/logic";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { useState, useEffect, useMemo } from "react";
import { scramble, sortSolves } from "../utils/logic";
import Auth from "./components/auth";
import Header from "./components/header";
import Leftmenu from "./components/leftmenu";
import Rightmenu from "./components/rightmenu";
import Timer from "./components/timer";

const Home: NextPage = () => {
    const session = useSession();
    const { data: currentRoom } = trpc.room.getCurrent.useQuery();
    const [currentScramble, setCurrentScramble] = useState("");
    const [showRooms, setShowRooms] = useState(false);
    const [isCardOpen, setIsCardOpen] = useState<{
        is: boolean;
        ao5: boolean;
        index: number;
    }>({ is: false, ao5: false, index: NaN });
    const [sorting, setSorting] = useState<{
        ao5: boolean;
        order: "latest" | "oldest" | "best" | "worst";
    }>({ ao5: false, order: "latest" });

    let solves: {
        time: string;
        solves: Solve[];
    }[] = [];

    solves = useMemo(() => {
        if (currentRoom) {
            return sortSolves(currentRoom.solves, sorting.order, sorting.ao5);
        }
        return [];
    }, [sorting.ao5, sorting.order, currentRoom]);

    useEffect(() => {
        if (isCardOpen.is) {
            document.body.style.height = "100%";
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.height = "auto";
            document.body.style.overflow = "scroll";
        }
    });

    useEffect(() => {
        setCurrentScramble(scramble());
    }, []);

    if (session.status === "loading")
        return (
            <div className="bg-[#3c3c3c] h-screen">
                <div className="bg-[#171717] h-[96px]">
                    <p className="text-white">Loading...</p>
                </div>
            </div>
        );

    if (session.status === "unauthenticated")
        return (
            <div>
                <Auth />
            </div>
        );

    if (!currentRoom)
        return (
            <div className="bg-[#3c3c3c] h-screen">
                <div className="bg-[#171717] h-[96px]">
                    <p className="text-white">Loading...</p>
                </div>
            </div>
        );

    return (
        <div>
            {session?.data?.user?.name ? (
                <div>
                    <Header
                        username={session.data.user.name}
                        currentScramble={currentScramble}
                        setCurrentScramble={setCurrentScramble}
                        roomName={currentRoom.name}
                        showRooms={showRooms}
                        setShowRooms={setShowRooms}
                    />
                    <div className="grid grid-cols-biglayout big-layout tab:grid-cols-mediumlayout mob:small-layout mob:grid-cols-smalllayout">
                        <Leftmenu
                            isCardOpen={isCardOpen}
                            setIsCardOpen={setIsCardOpen}
                            solves={solves}
                            sorting={sorting}
                            setSorting={setSorting}
                        />
                        <Timer
                            isCardOpen={isCardOpen}
                            setIsCardOpen={setIsCardOpen}
                            latestSolveTime={currentRoom.latestSolveTime}
                            solvesLength={currentRoom.solves.length}
                            roomId={currentRoom.id}
                            currentScramble={currentScramble}
                            setCurrentScramble={setCurrentScramble}
                            showRooms={showRooms}
                            setShowRooms={setShowRooms}
                        />
                        <Rightmenu
                            solvesLength={currentRoom.solves.length}
                            roomId={currentRoom.id}
                            single={currentRoom.singleBestLatest}
                            ao5={currentRoom.ao5BestLatest}
                            ao12={currentRoom.ao12BestLatest}
                            ao100={currentRoom.ao100BestLatest}
                            mean={currentRoom.mean}
                            betterThan={currentRoom.betterThan}
                        />
                    </div>
                </div>
            ) : (
                <div>something went wrong</div>
            )}
        </div>
    );
};

export default Home;
