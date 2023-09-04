import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { useRef, Dispatch, SetStateAction, useState, useEffect } from "react";
import { scramble } from "../../utils/logic";

const Timer: NextPage<{
    roomId: string;
    latestSolveTime: string;
    solvesLength: number;
    currentScramble: string;
    setCurrentScramble: Dispatch<SetStateAction<string>>;
    isCardOpen: {
        is: boolean;
        ao5: boolean;
        index: number;
    };
    setIsCardOpen: Dispatch<
        SetStateAction<{
            is: boolean;
            ao5: boolean;
            index: number;
        }>
    >;
    showRooms: boolean;
    setShowRooms: Dispatch<SetStateAction<boolean>>;
}> = ({
    roomId,
    latestSolveTime,
    solvesLength,
    currentScramble,
    setCurrentScramble,
    isCardOpen,
    showRooms,
}) => {
    const utils = trpc.useContext();
    const [started, setStarted] = useState(false);
    const { mutate: addSolve } = trpc.solve.add.useMutation({
        onMutate: (newSolve) => setLatestTime(newSolve.time),
        onSuccess: (_, newSolve) => {
            setLatestTime(newSolve.time);
            utils.room.getCurrent.invalidate();
        },
    });
    const [should, setShould] = useState(true);
    const time = useRef(0);
    const [solving, setSolving] = useState(false);
    const touchTimerElement = useRef<HTMLDivElement | null>(null);
    const [latestTime, setLatestTime] = useState(latestSolveTime);

    useEffect(() => {
        const handleStart = (e: KeyboardEvent): void => {
            e.preventDefault();
            if (!started && e.key === " " && !isCardOpen.is && !showRooms) {
                if (should) {
                    setSolving(true);
                    setStarted(() => true);
                    time.current = performance.now();
                } else {
                    setShould(true);
                }
            }
        };
        const handleStop = (e: KeyboardEvent): void => {
            if (started && e.key === " ") {
                setCurrentScramble(scramble());
                const newTime = (
                    (performance.now() - time.current) /
                    1000
                ).toFixed(2);
                addSolve({
                    roomId: roomId,
                    scramble: currentScramble,
                    time: newTime,
                });
                setSolving(false);
                setShould(false);
                setStarted(() => false);
            }
        };
        const handleStartTouch = (): void => {
            if (!started && !isCardOpen.is && !showRooms) {
                if (should) {
                    setSolving(true);
                    setStarted(() => true);
                    time.current = performance.now();
                } else {
                    setShould(true);
                }
            }
        };
        const handleStopTouch = (): void => {
            if (started) {
                setCurrentScramble(scramble());
                const newTime = (
                    (performance.now() - time.current) /
                    1000
                ).toFixed(2);
                addSolve({
                    roomId: roomId,
                    scramble: currentScramble,
                    time: newTime,
                });
                setSolving(false);
                setShould(false);
                setStarted(() => false);
            }
        };
        document.addEventListener("keyup", handleStart);
        document.addEventListener("keydown", handleStop);
        const timerCurrent = touchTimerElement.current;
        if (timerCurrent != null)
            timerCurrent.addEventListener("touchend", handleStartTouch);
        if (timerCurrent != null)
            timerCurrent.addEventListener("touchstart", handleStopTouch);
        return () => {
            document.removeEventListener("keyup", handleStart);
            document.removeEventListener("keydown", handleStop);
            if (timerCurrent != null)
                timerCurrent.removeEventListener("touchend", handleStartTouch);
            if (timerCurrent != null)
                timerCurrent.removeEventListener("touchstart", handleStopTouch);
        };
    }, [
        started,
        should,
        isCardOpen,
        showRooms,
        setCurrentScramble,
        currentScramble,
        addSolve,
        roomId,
    ]);

    return (
        <div
            ref={touchTimerElement}
            className="area-timer bg-[#3c3c3c] grid place-content-center order-2 mob:order-1 mob:h-[calc(100vh-112px-340px)]"
        >
            {solving ? (
                <p className="text-white text-[175px] tab:text-[110px] mob:text-[100px]">
                    SOLVING
                </p>
            ) : (
                <p className="text-white text-[300px] tab:text-[175px] mob:text-[150px]">
                    {latestTime}
                </p>
            )}
        </div>
    );
};

export default Timer;
