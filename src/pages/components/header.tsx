import type { NextPage } from "next";
import { useState, Dispatch, SetStateAction } from "react";
import { signOut } from "next-auth/react";
import { scramble } from "../../utils/logic";
import { trpc } from "../../utils/trpc";
import arrDown2 from "../../media/arr_down2.svg";
import Image from "next/image";

const Header: NextPage<{
    username: string;
    roomName: string;
    currentScramble: string;
    setCurrentScramble: Dispatch<SetStateAction<string>>;
    showRooms: boolean;
    setShowRooms: Dispatch<SetStateAction<boolean>>;
}> = ({
    username,
    roomName,
    currentScramble,
    setCurrentScramble,
    showRooms,
    setShowRooms,
}) => {
    const utils = trpc.useContext();
    const [newRoomName, setNewRoomName] = useState("");
    const { data: rooms } = trpc.room.getAll.useQuery();
    const { mutate: selectRoom } = trpc.room.select.useMutation({
        onSuccess: async () => {
            await utils.room.getCurrent.invalidate();
            setShowRooms(false);
            setNewRoomName("");
            await utils.room.getAll.invalidate();
        },
    });
    const { mutate: createRoom } = trpc.room.create.useMutation({
        onSuccess: async () => {
            await utils.room.getCurrent.invalidate();
            setShowRooms(false);
            setNewRoomName("");
            await utils.room.getAll.invalidate();
        },
    });

    return (
        <div className="relative z-10 bg-neutral-900">
            <div className="hidden mob:grid place-content-center mob:h-14">
                <p className="text-white text-4xl word-spacing-big mob:text-lg mob:text-center">
                    {currentScramble}
                </p>
            </div>
            <div className="max-w-[1500px] w-11/12 mx-auto flex items-center justify-between h-24 mob:h-14">
                <div>
                    <button
                        className="text-white p-3 bg-neutral-800 flex items-center gap-4 w-[150px] justify-center mob:text-xs mob:p-2 mob:w-[105px]"
                        onClick={() => setShowRooms(!showRooms)}
                    >
                        {roomName}
                        <Image
                            width={17}
                            height={17}
                            src={arrDown2.src}
                            className="w-[17px] h-[17px] mob:w-[13px] mob:h-[13px]"
                            alt="arrow down"
                        />
                    </button>
                    <div
                        className={`roomsScroll h-[247px] overflow-y-scroll ${
                            showRooms ? "block" : "hidden"
                        } w-[150px] absolute bg-neutral-800 mob:w-[105px]`}
                    >
                        <div className="bg-neutral-600 p-[5px] flex items-center justify-between">
                            <input
                                className="w-[113px] h-[29px] bg-neutral-500 text-white p-1 rounded-[5px] mob:text-xs mob:w-[76px]"
                                value={newRoomName}
                                onChange={(e) => setNewRoomName(e.target.value)}
                            />
                            <button
                                className="text-green-500 text-xl px-1 mb-[1px] mob:text-base mob:ml-[2.5px]"
                                onClick={() => {
                                    createRoom({ name: newRoomName });
                                }}
                            >
                                +
                            </button>
                        </div>
                        {rooms?.rooms.map((room) => (
                            <div
                                onClick={() => selectRoom(room.id)}
                                key={room.id}
                                className="text-white p-[5px] h-[42px] grid place-content-center cursor-pointer mob:text-xs"
                            >
                                <p>{room.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <p className="text-white text-center text-4xl word-spacing-big tab:text-2xl mob:text-lg mob:hidden">
                        {currentScramble}
                    </p>
                    <button
                        className="text-2xl text-green-500 bg-neutral-800 px-4 py-1 mob:text-lg mob:px-3 mob:py-0"
                        onClick={() => {
                            setCurrentScramble(scramble());
                        }}
                    >
                        +
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center gap-1">
                    <p className="text-white scroll-m-36 mob:text-[10px]">
                        @{username}
                    </p>
                    <button
                        className="px-4 py-1 rounded-full text-white text-xs bg-neutral-800 mob:text-[8px] mob:px-3 mob:py-0"
                        onClick={() => signOut()}
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
