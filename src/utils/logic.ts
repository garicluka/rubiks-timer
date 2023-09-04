export type Solve = {
    time: string;
    comment: string;
    scramble: string;
    id: string;
    createdAt: string;
    plusTwo: boolean;
    dnf: boolean;
};

export function scramble(): string {
    const possibleMoves = [
        "R",
        "L",
        "U",
        "D",
        "F",
        "B",
        "R'",
        "L'",
        "U'",
        "D'",
        "F'",
        "B'",
        "R2",
        "L2",
        "U2",
        "D2",
        "F2",
        "B2",
    ];

    const numberOfMoves = 20;

    const getRandomMove = () => {
        const randomMove = Math.random() * possibleMoves.length;
        return possibleMoves[Math.floor(randomMove)];
    };

    const isSameSide = (move1: string, move2: string) => {
        return move1[0] === move2[0];
    };

    const isOppositeSide = (move1: string, move2: string) => {
        if (move1[0] === "L" && move2[0] === "R") return true;
        if (move1[0] === "R" && move2[0] === "L") return true;
        if (move1[0] === "F" && move2[0] === "B") return true;
        if (move1[0] === "B" && move2[0] === "F") return true;
        if (move1[0] === "D" && move2[0] === "U") return true;
        if (move1[0] === "U" && move2[0] === "D") return true;
        return false;
    };

    let scramble = [];

    while (scramble.length < numberOfMoves) {
        const newRandomMove = getRandomMove();
        if (
            scramble.length > 0 &&
            isSameSide(scramble[scramble.length - 1], newRandomMove)
        ) {
            continue; // R R -> R2 (first one have 1 useless move)
        }
        if (
            scramble.length > 1 &&
            isOppositeSide(scramble[scramble.length - 1], newRandomMove) &&
            isSameSide(scramble[scramble.length - 2], newRandomMove)
        ) {
            continue; // R L R -> R2 L (first one have 1 useless move)
        }
        scramble.push(newRandomMove);
    }

    return scramble.join(" ");
}

export const sortSolves = (
    solves: Solve[],
    order: "latest" | "oldest" | "best" | "worst",
    ao5: boolean
) => {
    const createBestAo5 = (oldSolves: { solves: Solve[]; time: string }[]) => {
        const newSolves: { solves: Solve[]; time: string }[] = [...oldSolves];
        newSolves.sort((a, b) => {
            if (a.time === "none") return 1;
            if (b.time === "none") return -1;
            if (a.time === "dnf") return 1;
            if (b.time === "dnf") return -1;
            return Number(a.time) - Number(b.time);
        });
        return newSolves;
    };
    const createBestSingle = (
        oldSolves: { solves: Solve[]; time: string }[]
    ) => {
        const newSolves: { solves: Solve[]; time: string }[] = [...oldSolves];
        newSolves.sort((a, b) => {
            if (a.solves[0].time === "dnf") return 1;
            if (b.solves[0].time === "dnf") return -1;
            return Number(a.solves[0].time) - Number(b.solves[0].time);
        });
        return newSolves;
    };
    const createLatest = (oldSolves: Solve[]) => {
        const newSolves: { solves: Solve[]; time: string }[] = [];
        for (let i = 0; i < solves.length; i++) {
            if (oldSolves.length - i < 5) {
                const time1 = Number(
                    oldSolves[i].dnf
                        ? NaN
                        : oldSolves[i].plusTwo
                            ? Number(oldSolves[i].time) + 2
                            : oldSolves[i].time
                );
                newSolves.push({
                    time: "none",
                    solves: [
                        {
                            ...solves[i],
                            time: isNaN(time1) ? "dnf" : time1.toFixed(2),
                        },
                    ],
                });
            } else {
                const time1 = Number(
                    oldSolves[i].dnf
                        ? NaN
                        : oldSolves[i].plusTwo
                            ? Number(oldSolves[i].time) + 2
                            : oldSolves[i].time
                );
                const time2 = Number(
                    oldSolves[i + 1].dnf
                        ? NaN
                        : oldSolves[i + 1].plusTwo
                            ? Number(oldSolves[i + 1].time) + 2
                            : oldSolves[i + 1].time
                );
                const time3 = Number(
                    oldSolves[i + 2].dnf
                        ? NaN
                        : oldSolves[i + 2].plusTwo
                            ? Number(oldSolves[i + 2].time) + 2
                            : oldSolves[i + 2].time
                );
                const time4 = Number(
                    oldSolves[i + 3].dnf
                        ? NaN
                        : oldSolves[i + 3].plusTwo
                            ? Number(oldSolves[i + 3].time) + 2
                            : oldSolves[i + 3].time
                );
                const time5 = Number(
                    oldSolves[i + 4].dnf
                        ? NaN
                        : oldSolves[i + 4].plusTwo
                            ? Number(oldSolves[i + 4].time) + 2
                            : oldSolves[i + 4].time
                );
                let validTimesNum = 0;
                let best = +Infinity;
                let worst = -Infinity;
                let sum = 0;
                if (!isNaN(time1)) {
                    validTimesNum++;
                    if (time1 < best) {
                        best = time1;
                    }
                    if (time1 > worst) {
                        worst = time1;
                    }
                    sum += time1;
                }
                if (!isNaN(time2)) {
                    validTimesNum++;
                    if (time2 < best) {
                        best = time2;
                    }
                    if (time2 > worst) {
                        worst = time2;
                    }
                    sum += time2;
                }
                if (!isNaN(time3)) {
                    validTimesNum++;
                    if (time3 < best) {
                        best = time3;
                    }
                    if (time3 > worst) {
                        worst = time3;
                    }
                    sum += time3;
                }
                if (!isNaN(time4)) {
                    validTimesNum++;
                    if (time4 < best) {
                        best = time4;
                    }
                    if (time4 > worst) {
                        worst = time4;
                    }
                    sum += time4;
                }
                if (!isNaN(time5)) {
                    validTimesNum++;
                    if (time5 < best) {
                        best = time5;
                    }
                    if (time5 > worst) {
                        worst = time5;
                    }
                    sum += time5;
                }
                let time = "";
                if (validTimesNum < 4) {
                    time = "dnf";
                } else if (validTimesNum === 4) {
                    time = ((sum - best) / 3).toFixed(2);
                } else {
                    time = ((sum - best - worst) / 3).toFixed(2);
                }
                newSolves.push({
                    time,
                    solves: [
                        {
                            ...solves[i],
                            time: isNaN(time1) ? "dnf" : time1.toFixed(2),
                        },
                        {
                            ...solves[i + 1],
                            time: isNaN(time2) ? "dnf" : time2.toFixed(2),
                        },
                        {
                            ...solves[i + 2],
                            time: isNaN(time3) ? "dnf" : time3.toFixed(2),
                        },
                        {
                            ...solves[i + 3],
                            time: isNaN(time4) ? "dnf" : time4.toFixed(2),
                        },
                        {
                            ...solves[i + 4],
                            time: isNaN(time5) ? "dnf" : time5.toFixed(2),
                        },
                    ],
                });
            }
        }
        return newSolves;
    };

    // create new array in different format
    const tempLatestSolves = createLatest(solves);
    // sorting depending on requirements
    let finalSolves: {
        time: string;
        solves: Solve[];
    }[] = [];
    if (order === "latest") {
        finalSolves = tempLatestSolves;
    }
    if (order === "oldest") {
        finalSolves = tempLatestSolves.reverse();
    }
    if (order === "best") {
        if (ao5) {
            const tempBestAo5Solves = createBestAo5(tempLatestSolves);
            finalSolves = tempBestAo5Solves;
        } else {
            const tempBestSingleSolves = createBestSingle(tempLatestSolves);
            finalSolves = tempBestSingleSolves;
        }
    }
    if (order === "worst") {
        if (ao5) {
            const tempBestAo5Solves = createBestAo5(tempLatestSolves);
            finalSolves = tempBestAo5Solves.reverse();
        } else {
            const tempBestSingleSolves = createBestSingle(tempLatestSolves);
            finalSolves = tempBestSingleSolves.reverse();
        }
    }

    return finalSolves;
};

// ignores DNFs
export const mean = (solves: string[]): string => {
    let sum = 0;
    let len = 0;
    for (let solve of solves) {
        if (solve != "dnf") {
            len++;
            sum += Number(solve);
        }
    }
    if (len === 0) {
        if (solves.length > 0) {
            return "dnf";
        }
        return "none";
    }
    return (sum / len).toFixed(2);
};

// generateBetterThanLast exist even though generateBetterThanLast exists because type differences
export const betterThanLast = (solves: string[]): string => {
    if (solves.length === 0) return "50";
    if (solves.length === 1) return "100";
    if (solves[0] === "dnf") return "0";

    let betterThanNum = 0;
    const numberToCompare = solves[0];
    for (let i = 1; i < solves.length; i++) {
        if (solves[i] === "dnf") {
            betterThanNum++;
            continue;
        }
        if (Number(numberToCompare) < Number(solves[i])) betterThanNum++;
    }

    return ((betterThanNum / (solves.length - 1)) * 100).toFixed();
};

export const betterThanSingle = (
    data: { solves: Solve[]; time: string }[],
    index: number
): string => {
    if (data.length === 0) return "50";
    if (data.length === 1) return "100";
    if (data[index].solves[0].time === "dnf") return "0";

    let betterThanNum = 0;
    const numberToCompare = data[index].solves[0].time;
    for (let i = 0; i < data.length; i++) {
        if (i === index) {
            continue;
        }
        if (data[i].solves[0].time === "dnf") {
            betterThanNum++;
            continue;
        }
        if (Number(numberToCompare) < Number(data[i].solves[0].time))
            betterThanNum++;
    }

    return ((betterThanNum / (data.length - 1)) * 100).toFixed();
};

export const betterThanAo5 = (
    data: { solves: Solve[]; time: string }[],
    index: number
): string => {
    if (data.length === 0) return "50";
    if (data.length === 1) return "100";
    if (data[index].time === "dnf" || data[index].time === "none") return "0";

    let betterThanNum = 0;
    const numberToCompare = data[index].time;
    for (let i = 0; i < data.length; i++) {
        if (i === index) {
            continue;
        }
        if (data[i].time === "dnf" || data[i].time === "none") {
            betterThanNum++;
            continue;
        }
        if (Number(numberToCompare) < Number(data[i].time)) betterThanNum++;
    }

    return ((betterThanNum / (data.length - 1)) * 100).toFixed();
};

export const singleLastBest = (
    solves: string[]
): { last: string; best: string } => {
    if (solves.length === 0) {
        return { last: "none", best: "none" };
    }

    let bestTime = "dnf";
    for (let solve of solves) {
        if (solve === "dnf") continue;
        if (bestTime === "dnf") {
            bestTime = solve;
            continue;
        }
        if (Number(solve) < Number(bestTime)) bestTime = solve;
    }

    return { last: solves[0], best: bestTime };
};

// it may be possible to merge generate ao5, ao12 and ao100 (accurate version of ao12 and ao100 are too slow for now)
export const ao5LastBest = (
    solves: string[]
): { last: string; best: string } => {
    const calculateAo5 = (
        time1: string,
        time2: string,
        time3: string,
        time4: string,
        time5: string
    ): string => {
        // it may be be easier to sort solves instead (not sure about performance of it)
        let validTimesNum = 0;
        let best = +Infinity;
        let worst = -Infinity;
        let sum = 0;

        if (time1 != "dnf") {
            const time1Num = Number(time1);
            validTimesNum++;
            if (time1Num < best) {
                best = time1Num;
            }
            if (time1Num > worst) {
                worst = time1Num;
            }
            sum += time1Num;
        }
        if (time2 != "dnf") {
            const time2Num = Number(time2);
            validTimesNum++;
            if (time2Num < best) {
                best = time2Num;
            }
            if (time2Num > worst) {
                worst = time2Num;
            }
            sum += time2Num;
        }
        if (time3 != "dnf") {
            const time3Num = Number(time3);
            validTimesNum++;
            if (time3Num < best) {
                best = time3Num;
            }
            if (time3Num > worst) {
                worst = time3Num;
            }
            sum += time3Num;
        }
        if (time4 != "dnf") {
            const time4Num = Number(time4);
            validTimesNum++;
            if (time4Num < best) {
                best = time4Num;
            }
            if (time4Num > worst) {
                worst = time4Num;
            }
            sum += time4Num;
        }
        if (time5 != "dnf") {
            const time5Num = Number(time5);
            validTimesNum++;
            if (time5Num < best) {
                best = time5Num;
            }
            if (time5Num > worst) {
                worst = time5Num;
            }
            sum += time5Num;
        }

        let time = "";
        if (validTimesNum < 4) {
            time = "dnf";
        } else if (validTimesNum === 4) {
            time = ((sum - best) / 3).toFixed(2);
        } else {
            time = ((sum - best - worst) / 3).toFixed(2);
        }
        return time;
    };

    let lastAo5 = "none";
    if (solves.length >= 5) {
        lastAo5 = calculateAo5(
            solves[0],
            solves[1],
            solves[2],
            solves[3],
            solves[4]
        );
    }
    let bestAo5 = "none";
    for (let i = 0; i < solves.length; i++) {
        if (solves.length - i < 5) break;
        const currentAo5 = calculateAo5(
            solves[i],
            solves[i + 1],
            solves[i + 2],
            solves[i + 3],
            solves[i + 4]
        );
        if (bestAo5 === "none") {
            bestAo5 = currentAo5;
            continue;
        }
        if (currentAo5 === "dnf") {
            continue;
        }
        if (bestAo5 === "dnf") {
            bestAo5 = currentAo5;
            continue;
        }
        if (Number(currentAo5) < Number(bestAo5)) bestAo5 = currentAo5;
    }

    if (lastAo5 != "none" && lastAo5 != "dnf") {
        lastAo5 = Number(lastAo5).toFixed(2);
    }
    if (bestAo5 != "none" && bestAo5 != "dnf") {
        bestAo5 = Number(bestAo5).toFixed(2);
    }

    return {
        last: lastAo5,
        best: bestAo5,
    };
};

// generateAo12 is not 100% accurate because accurate version is too slow
export const ao12LastBest = (
    solves: string[]
): { last: string; best: string } => {
    const calculateAo12 = (position: number): string => {
        let validTimesNum = 0;
        let validTimesSum = 0;
        for (let solve = position; solve < position + 12; solve++) {
            if (solves[solve] != "dnf") {
                validTimesNum += 1;
                validTimesSum += Number(solves[solve]);
            }
        }
        if (validTimesNum < 11) return "dnf";
        return String(validTimesSum / validTimesNum);
    };

    let lastAo12 = "none";
    if (solves.length >= 12) {
        lastAo12 = calculateAo12(0);
    }
    let bestAo12 = "none";
    for (let i = 0; i < solves.length; i++) {
        if (solves.length - i < 12) break;
        const currentAo12 = calculateAo12(i);
        if (bestAo12 === "none") {
            bestAo12 = currentAo12;
            continue;
        }
        if (currentAo12 === "dnf") {
            continue;
        }
        if (bestAo12 === "dnf") {
            bestAo12 = currentAo12;
            continue;
        }
        if (Number(currentAo12) < Number(bestAo12)) bestAo12 = currentAo12;
    }

    if (lastAo12 != "none" && lastAo12 != "dnf") {
        lastAo12 = Number(lastAo12).toFixed(2);
    }
    if (bestAo12 != "none" && bestAo12 != "dnf") {
        bestAo12 = Number(bestAo12).toFixed(2);
    }

    return {
        last: lastAo12,
        best: bestAo12,
    };
};

// generateAo100 is not 100% accurate because accurate version is too slow
export const ao100LastBest = (
    solves: string[]
): { last: string; best: string } => {
    const calculateAo100 = (position: number): string => {
        let validTimesNum = 0;
        let validTimesSum = 0;
        for (let solve = position; solve < position + 100; solve++) {
            if (solves[solve] != "dnf") {
                validTimesNum++;
                validTimesSum += Number(solves[solve]);
            }
        }
        if (validTimesNum < 95) return "dnf";
        return String(validTimesSum / validTimesNum);
    };

    let lastAo100 = "none";
    if (solves.length >= 100) {
        const avg = calculateAo100(0);
        lastAo100 = avg;
    }
    let bestAo100 = "none";
    for (let i = 0; i < solves.length; i++) {
        if (solves.length - i < 100) break;
        const currentAo100 = calculateAo100(i);
        if (bestAo100 === "none") {
            bestAo100 = currentAo100;
            continue;
        }
        if (currentAo100 === "dnf") {
            continue;
        }
        if (bestAo100 === "dnf") {
            bestAo100 = currentAo100;
            continue;
        }
        if (Number(currentAo100) < Number(bestAo100)) bestAo100 = currentAo100;
    }

    if (lastAo100 != "none" && lastAo100 != "dnf") {
        lastAo100 = Number(lastAo100).toFixed(2);
    }
    if (bestAo100 != "none" && bestAo100 != "dnf") {
        bestAo100 = Number(bestAo100).toFixed(2);
    }

    return {
        last: lastAo100,
        best: bestAo100,
    };
};
