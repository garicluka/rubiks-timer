import type { NextPage } from "next";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

const Rightmenu: NextPage<{
    solvesLength: number;
    roomId: string;
    mean: string;
    betterThan: string;
    single: {
        last: string;
        best: string;
    };
    ao5: {
        last: string;
        best: string;
    };
    ao12: {
        last: string;
        best: string;
    };
    ao100: {
        last: string;
        best: string;
    };
}> = ({ solvesLength, roomId, mean, betterThan, single, ao5, ao12, ao100 }) => {
    const utils = trpc.useContext();
    const { mutate: deleteRoom } = trpc.room.delete.useMutation({
        onSuccess: async () => {
            await utils.room.getCurrent.invalidate();
            utils.room.getAll.invalidate();
        },
    });
    const [open, setOpen] = useState(false);

    return (
        <div className="area-right flex flex-col justify-between bg-[#3F3F3F] h-[calc(100vh-96px)] order-3 mob:order-3 mob:h-[340px] mob:bg-[#3c3c3c]">
            <div>
                <div className="flex justify-center items-center mt-[25px] gap-12 mob:mt-0 mob:justify-end mob:mr-[16px]">
                    <div>
                        <p className="text-white text-[10px] text-center mb-[2px] mob:text-[7px] mob:mb-0">
                            Better Than
                        </p>
                        <p className="text-3xl text-purple-400 text-center mob:text-[20px]">
                            {betterThan}%
                        </p>
                    </div>
                    <div>
                        <p className="text-white text-[10px] text-center mb-[2px] mob:text-[7px] mob:mb-0">
                            Mean/Solves
                        </p>
                        <p className="text-3xl text-purple-400 text-center mb-[2px] mob:text-[20px] mob:mb-[0px]">
                            {mean}
                        </p>
                        <p className="text-white text-[15px] text-center mob:text-[10px]">
                            ({solvesLength})
                        </p>
                    </div>
                </div>
                <div className="mb-4 hidden justify-end mr-[16px] mob:grid mob:mt-4 mob:mb-2 relative">
                    <button
                        className="text-red-500 border border-red-500 bg-[#2c2c2c] text-xs px-[78px] py-[12px] mob:text-[8px] mob:px-[55px] mob:py-[10px]"
                        onClick={() => setOpen(true)}
                    >
                        Delete Room!
                    </button>
                    <div
                        className={`bg-[#333333] top-0 bottom-0 right-0 w-[207px] flex items-center justify-evenly text-white absolute ${
                            open ? "block" : "hidden"
                        }`}
                    >
                        <p className="text-sm">DELETE ROOM?</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    deleteRoom(roomId);
                                    setOpen(false);
                                }}
                                className="text-green-400"
                            >
                                YES
                            </button>

                            <button
                                className="text-red-400"
                                onClick={() => setOpen(false)}
                            >
                                NO
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white h-[1px] w-[188px] mx-auto mt-6 mb-3 mob:hidden"></div>
                <div className="auto-rows-[46px] text-center gap-y-2 grid place-content-center grid-cols-[80px_80px_80px] mob:auto-rows-[31px] mob:grid-cols-[69px_69px_69px] mob:justify-end mr-[16px]">
                    <p></p>
                    <div className="grid items-end">
                        <p className="text-lg font-light text-purple-400 mob:text-sm">
                            Last
                        </p>
                    </div>
                    <div className="grid items-end">
                        <p className="text-lg font-light text-purple-400 mob:text-sm">
                            Best
                        </p>
                    </div>
                    <div className="bg-[#444444] grid items-center pl-4 justify-start">
                        <p className="text-lg text-purple-400 mob:text-sm">
                            Single
                        </p>
                    </div>
                    <div className="relative bg-[#444444] grid place-content-center after:top-[50%] after:-translate-y-1/2 after:right-[-1px] after:content-[' '] after:bg-purple-400 after:h-[18px] after:w-[1px] after:absolute">
                        <p className="bg-[#444444] text-lg text-white mob:text-sm">
                            {single.last}
                        </p>
                    </div>
                    <div className="bg-[#444444] grid place-content-center">
                        <p className="bg-[#444444] text-lg text-white mob:text-sm">
                            {single.best}
                        </p>
                    </div>
                    <div className="bg-[#444444] grid items-center pl-4 justify-start">
                        <p className="text-lg text-purple-400 mob:text-sm">
                            Ao5
                        </p>
                    </div>
                    <div className="relative bg-[#444444] grid place-content-center after:top-[50%] after:-translate-y-1/2 after:right-[-1px] after:content-[' '] after:bg-purple-400 after:h-[18px] after:w-[1px] after:absolute">
                        <p className="bg-[#444444] text-lg text-white mob:text-sm">
                            {ao5.last}
                        </p>
                    </div>
                    <div className="bg-[#444444] grid place-content-center">
                        <p className="bg-[#444444] text-lg text-white mob:text-sm">
                            {ao5.best}
                        </p>
                    </div>
                    <div className="bg-[#444444] grid items-center pl-4 justify-start">
                        <p className="text-lg text-purple-400 mob:text-sm">
                            Ao12
                        </p>
                    </div>
                    <div className="relative bg-[#444444] grid place-content-center after:top-[50%] after:-translate-y-1/2 after:right-[-1px] after:content-[' '] after:bg-purple-400 after:h-[18px] after:w-[1px] after:absolute">
                        <p className="bg-[#444444] text-lg text-white mob:text-sm">
                            {ao12.last}
                        </p>
                    </div>
                    <div className="bg-[#444444] grid place-content-center">
                        <p className="bg-[#444444] text-lg text-white mob:text-sm">
                            {ao12.best}
                        </p>
                    </div>
                    <div className="bg-[#444444] grid items-center pl-4 justify-start">
                        <p className="text-lg text-purple-400 mob:text-sm">
                            Ao100
                        </p>
                    </div>
                    <div className="relative bg-[#444444] grid place-content-center after:top-[50%] after:-translate-y-1/2 after:right-[-1px] after:content-[' '] after:bg-purple-400 after:h-[18px] after:w-[1px] after:absolute">
                        <p className="bg-[#444444] text-lg text-white mob:text-sm">
                            {ao100.last}
                        </p>
                    </div>
                    <div className="bg-[#444444] grid place-content-center">
                        <p className="bg-[#444444] text-lg text-white mob:text-sm">
                            {ao100.best}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mb-[52px] grid place-content-center mob:hidden relative">
                <button
                    className="text-red-500 border border-red-500 bg-[#2c2c2c] text-xs px-[78px] py-[12px] mob:text-[8px] mob:px-[55px] mob:py-[10px]"
                    onClick={() => setOpen(true)}
                >
                    Delete Room!
                </button>
                <div
                    className={`bg-[#333333] inset-0 flex items-center justify-evenly text-white absolute ${
                        open ? "block" : "hidden"
                    }`}
                >
                    <p className="text-xl">DELETE ROOM?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                deleteRoom(roomId);
                                setOpen(false);
                            }}
                            className="text-green-400"
                        >
                            YES
                        </button>

                        <button
                            className="text-red-400"
                            onClick={() => setOpen(false)}
                        >
                            NO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rightmenu;
