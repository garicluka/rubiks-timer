import type { NextPage } from "next";
import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";
import Card from "./card";

const Leftmenu: NextPage<{
    solves: {
        solves: {
            id: string;
            createdAt: string;
            scramble: string;
            time: string;
            plusTwo: boolean;
            dnf: boolean;
            comment: string;
        }[];
        time: string;
    }[];
    setIsCardOpen: Dispatch<
        SetStateAction<{
            is: boolean;
            ao5: boolean;
            index: number;
        }>
    >;
    isCardOpen: {
        is: boolean;
        ao5: boolean;
        index: number;
    };
    sorting: {
        ao5: boolean;
        order: "latest" | "oldest" | "best" | "worst";
    };
    setSorting: Dispatch<
        SetStateAction<{
            ao5: boolean;
            order: "latest" | "oldest" | "best" | "worst";
        }>
    >;
}> = ({ solves, setIsCardOpen, isCardOpen, sorting, setSorting }) => {
    const allSolves = solves;

    return (
        <div className="bg-[#3f3f3f] area-left mob:bg-[#3c3c3c]">
            <div className="mt-[16px] bg-[#484848] flex text-center items-center w-[232px] mx-auto mob:w-[200px] mob:ml-4 mob:mt-0">
                <div>
                    <button
                        onClick={() => {
                            setSorting({ ao5: sorting.ao5, order: "latest" });
                        }}
                        className={`text-white bg-[#484848] text-lg w-[90px] h-[50px] mob:text-[13px] mob:w-[74px] mob:h-[39px] ${
                            sorting.order === "latest" ? "font-bold" : ""
                        }`}
                    >
                        Latest
                    </button>
                    <button
                        onClick={() => {
                            setSorting({ ao5: sorting.ao5, order: "oldest" });
                        }}
                        className={`text-white bg-[#484848] text-lg  w-[90px] h-[50px] mob:text-[13px] mob:w-[74px] mob:h-[39px] ${
                            sorting.order === "oldest" ? "font-bold" : ""
                        }`}
                    >
                        Oldest
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => {
                            setSorting({ ao5: true, order: sorting.order });
                        }}
                        className={`relative text-white bg-[#434343] text-xs w-[53px] h-[40px] after:content-[' '] after:absolute after:w-[18px] after:h-[1px] after:bottom-0 after:right-1/2 after:translate-x-1/2 after:bg-purple-400 mob:text-[9px] mob:w-[52px] mob:h-[35px] ${
                            sorting.ao5 ? "font-bold" : ""
                        }`}
                    >
                        Ao5
                    </button>
                    <button
                        onClick={() => {
                            setSorting({ ao5: false, order: sorting.order });
                        }}
                        className={`text-white bg-[#434343] text-xs w-[53px] h-[40px] mob:text-[9px] mob:w-[52px] mob:h-[35px] ${
                            !sorting.ao5 ? "font-bold" : ""
                        }`}
                    >
                        Single
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => {
                            setSorting({ ao5: sorting.ao5, order: "best" });
                        }}
                        className={`text-white bg-[#484848] text-lg w-[90px] h-[50px] mob:text-[13px] mob:w-[74px] mob:h-[39px] ${
                            sorting.order === "best" ? "font-bold" : ""
                        }`}
                    >
                        Best
                    </button>
                    <button
                        onClick={() => {
                            setSorting({ ao5: sorting.ao5, order: "worst" });
                        }}
                        className={` text-white bg-[#484848] text-lg w-[90px] h-[50px] mob:text-[13px] mob:w-[74px] mob:h-[39px] ${
                            sorting.order === "worst" ? "font-bold" : ""
                        }`}
                    >
                        Worst
                    </button>
                </div>
            </div>
            <div className="flex mb-[18px] mt-[17px] mob:my-2">
                <p className="text-purple-400 text-[25px] ml-[58px] mob:text-[20px] mob:ml-[38px]">
                    Single
                </p>
                <p className="text-purple-400 text-[25px] ml-[63px] mob:text-[20px] mob:ml-[45px]">
                    Ao5
                </p>
            </div>
            <div className="solvesScroll overflow-y-scroll h-[calc(100vh-100px-116px-72.5px-10px)] mob:h-[calc(500px-100px-116px-72.5px-10px)] mob:ml-4 mob:w-[200px]">
                {useMemo(() => {
                    return allSolves.map((solve, i) => (
                        <div
                            key={solve.solves[0].id}
                            className="flex justify-center mb-[10px] mob:justify-start"
                        >
                            <div className="cursor-pointer w-[116px] h-[40px] bg-[#444444] grid place-items-center mob:w-[91px] mob:h-[31px]">
                                <p
                                    className="text-white text-lg mob:text-[14px]"
                                    onClick={() =>
                                        setIsCardOpen({
                                            is: true,
                                            ao5: false,
                                            index: i,
                                        })
                                    }
                                >
                                    {solve.solves[0].time}
                                </p>
                            </div>
                            <div className="cursor-pointer relative w-[116px] h-[40px] bg-[#444444] grid place-items-center before:content-[' '] before:absolute before:bg-purple-400 before:w-[1px] before:h-[18px] before:top-1/2 before:left-[0px] before:-translate-y-1/2 mob:w-[91px] mob:h-[31px]">
                                <p
                                    className="text-white text-lg mob:text-[14px]"
                                    onClick={() =>
                                        setIsCardOpen({
                                            is: true,
                                            ao5: true,
                                            index: i,
                                        })
                                    }
                                >
                                    {solve.time}
                                </p>
                            </div>
                        </div>
                    ));
                }, [allSolves, setIsCardOpen])}
            </div>
            {isCardOpen.is ? (
                <Card
                    ao5={isCardOpen.ao5}
                    data={allSolves}
                    index={isCardOpen.index}
                    setIsCardOpen={setIsCardOpen}
                />
            ) : (
                false
            )}
        </div>
    );
};

export default Leftmenu;
