import type { NextPage } from "next";
import { Dispatch, SetStateAction, useState } from "react";
import { trpc } from "../../utils/trpc";
import { betterThanSingle, betterThanAo5 } from "../../utils/logic";

const Card: NextPage<{
    ao5: boolean;
    data: {
        solves: {
            time: string;
            comment: string;
            scramble: string;
            id: string;
            createdAt: string;
            plusTwo: boolean;
            dnf: boolean;
        }[];
        time: string;
    }[];
    index: number;
    setIsCardOpen: Dispatch<
        SetStateAction<{
            is: boolean;
            ao5: boolean;
            index: number;
        }>
    >;
}> = ({ ao5, data, index, setIsCardOpen }) => {
    const utils = trpc.useContext();
    const [newCommentVal, setNewCommentVal] = useState(
        data[index].solves[0].comment
    );
    const { mutate: removeSolve } = trpc.solve.delete.useMutation({
        onSuccess: () => {
            utils.room.getCurrent.invalidate();
            setIsCardOpen({ is: false, ao5, index });
        },
    });
    const { mutate: updateSolve } = trpc.solve.update.useMutation({
        onSuccess: () => {
            utils.room.getCurrent.invalidate();
            setIsCardOpen({ is: false, ao5, index });
        },
    });

    const findIndexOf = (solve: {
        time: string;
        comment: string;
        scramble: string;
        id: string;
        createdAt: string;
        plusTwo: boolean;
        dnf: boolean;
    }): number => {
        let i = NaN;
        for (let d = 0; d < data.length; d++) {
            if (data[d].solves[0].id === solve.id) {
                i = d;
                break;
            }
        }
        return i;
    };

    return (
        <div
            className="w-screen h-screen z-10 top-0 left-0 fixed grid place-content-center"
            onClick={() => setIsCardOpen({ ao5, index, is: false })}
        >
            <div className="fixed top-0 left-0 h-screen w-screen bg-black opacity-50 z-10"></div>
            <div
                className="w-[789px] h-[544px] bg-[#3f3f3f] relative z-20 p-[35px] mob:h-[70vh] mob:w-[75vw] mob:p-[12px]"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                {ao5 ? (
                    <div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col items-center">
                                <p className="text-white text-[13px] font-light mob:text-[9px]">
                                    Better Than
                                </p>
                                <p className="text-white text-[24px] font-light mob:text-[20px]">
                                    {betterThanAo5(data, index)}%
                                </p>
                            </div>
                            <p className="text-white text-[31px] mob:text-[25px]">
                                {data[index].time}
                            </p>
                            <p className="text-white text-[21px] font-light mob:text-[17px]">
                                {data[index].solves[0].createdAt
                                    .toString()
                                    .slice(8, 10)}
                                /
                                {data[index].solves[0].createdAt
                                    .toString()
                                    .slice(5, 7)}
                                /
                                {data[index].solves[0].createdAt
                                    .toString()
                                    .slice(0, 4)}
                            </p>
                        </div>
                        <div className="grid place-content-center mt-16 mob:mt-28">
                            <div className="mx-auto">
                                {data[index].solves.map((solve) => (
                                    <div key={solve.id}>
                                        <div
                                            className="flex items-center cursor-pointer mb-2"
                                            onClick={() =>
                                                setIsCardOpen({
                                                    ao5: false,
                                                    is: true,
                                                    index: findIndexOf(solve),
                                                })
                                            }
                                        >
                                            <p className="mr-4 bg-[#444444] px-[27px] py-[9px] text-white text-lg mob:text-sm">
                                                {solve.time}
                                            </p>
                                            <div className="mr-4 bg-purple-400 h-[1px] w-[18px]"></div>
                                            <p className="text-white text-[20px] mob:text-base">
                                                {solve.scramble}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between">
                            <p className="text-[20px] text-white mob:text-[15px]">
                                {data[index].solves[0].scramble}
                            </p>
                            <p className="text-[31px] text-white mob:text-[25px]">
                                {data[index].solves[0].time}
                            </p>
                        </div>
                        <div className="flex items-center justify-between flex-wrap mob:justify-left mob:gap-5">
                            <div>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        updateSolve({
                                            newComment: newCommentVal,
                                            newDnf: data[index].solves[0].dnf,
                                            newPlusTwo:
                                                data[index].solves[0].plusTwo,
                                            solveId: data[index].solves[0].id,
                                        });
                                    }}
                                >
                                    <div className="flex items-center justify-between pb-2">
                                        <p className="text-white text-[19px] mob:text-[15px]">
                                            Comment:
                                        </p>
                                        <button
                                            className="text-[19px] text-purple-400 mob:text-[15px]"
                                            type="submit"
                                        >
                                            Save
                                        </button>
                                    </div>
                                    <textarea
                                        className="resize-none text-white text-[19px] bg-[#4b4b4b] w-[350px] h-[200px] p-2 mob:text-[15px] mob:w-[270px] mob:h-[150px]"
                                        value={newCommentVal}
                                        onChange={(e) =>
                                            setNewCommentVal(e.target.value)
                                        }
                                    />
                                </form>
                            </div>
                            <div className="flex flex-col items-end gap-3 mob:items-start">
                                <button
                                    onClick={() =>
                                        setIsCardOpen({
                                            ao5: true,
                                            index,
                                            is: true,
                                        })
                                    }
                                    className="bg-[#535353] text-purple-400 text-[25px] py-[1px] px-[20px] mob:text-[19px]"
                                >
                                    Ao5
                                </button>
                                <p className="text-[19px] text-white mob:text-[15px]">
                                    DNF:
                                    <button
                                        className={`ml-2 px-2 py-[1px] ${
                                            data[index].solves[0].dnf
                                                ? "bg-[#343434]"
                                                : "bg-[#535353]"
                                        }`}
                                        onClick={() =>
                                            updateSolve({
                                                newComment:
                                                    data[index].solves[0]
                                                        .comment,
                                                newDnf: true,
                                                newPlusTwo:
                                                    data[index].solves[0]
                                                        .plusTwo,
                                                solveId:
                                                    data[index].solves[0].id,
                                            })
                                        }
                                    >
                                        YES
                                    </button>
                                    <button
                                        className={`relative before:content-[' '] before:absolute before:bg-purple-400 before:w-[1px] before:h-[18px] before:top-1/2 before:left-0 before:-translate-y-1/2 px-2 py-[1px] ${
                                            !data[index].solves[0].dnf
                                                ? "bg-[#343434]"
                                                : "bg-[#535353]"
                                        }`}
                                        onClick={() =>
                                            updateSolve({
                                                newComment:
                                                    data[index].solves[0]
                                                        .comment,
                                                newDnf: false,
                                                newPlusTwo:
                                                    data[index].solves[0]
                                                        .plusTwo,
                                                solveId:
                                                    data[index].solves[0].id,
                                            })
                                        }
                                    >
                                        NO
                                    </button>
                                </p>
                                <p className="text-[19px] text-white mob:text-[15px]">
                                    Plus Two:
                                    <button
                                        className={`ml-2 px-2 py-[1px] ${
                                            data[index].solves[0].plusTwo
                                                ? "bg-[#343434]"
                                                : "bg-[#535353]"
                                        }`}
                                        onClick={() =>
                                            updateSolve({
                                                newComment:
                                                    data[index].solves[0]
                                                        .comment,
                                                newDnf: data[index].solves[0]
                                                    .dnf,
                                                newPlusTwo: true,
                                                solveId:
                                                    data[index].solves[0].id,
                                            })
                                        }
                                    >
                                        YES
                                    </button>
                                    <button
                                        className={`relative before:content-[' '] before:absolute before:bg-purple-400 before:w-[1px] before:h-[18px] before:top-1/2 before:left-0 before:-translate-y-1/2 px-2 py-[1px] ${
                                            !data[index].solves[0].plusTwo
                                                ? "bg-[#343434]"
                                                : "bg-[#535353]"
                                        }`}
                                        onClick={() =>
                                            updateSolve({
                                                newComment:
                                                    data[index].solves[0]
                                                        .comment,
                                                newDnf: data[index].solves[0]
                                                    .dnf,
                                                newPlusTwo: false,
                                                solveId:
                                                    data[index].solves[0].id,
                                            })
                                        }
                                    >
                                        NO
                                    </button>
                                </p>
                                <button
                                    className="mt-4 text-xs text-red-500 border border-red-500 px-[35px] py-[14px] bg-[#2c2c2c] mob:text-[8px] mob:px-[30px] mob:py-[12px]"
                                    onClick={() =>
                                        removeSolve(data[index].solves[0].id)
                                    }
                                >
                                    Delete Solve!
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col items-center">
                                <p className="text-white text-[13px] font-light mob:text-[9px]">
                                    Better Than
                                </p>
                                <p className="text-white text-2xl font-light mob:text-[20px]">
                                    {betterThanSingle(data, index)}%
                                </p>
                            </div>
                            <p className="text-white text-[21px] font-light mob:text-[17px]">
                                {data[index].solves[0].createdAt
                                    .toString()
                                    .slice(8, 10)}
                                /
                                {data[index].solves[0].createdAt
                                    .toString()
                                    .slice(5, 7)}
                                /
                                {data[index].solves[0].createdAt
                                    .toString()
                                    .slice(0, 4)}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;
