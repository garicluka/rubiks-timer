// this is accurate algorithm for getting best ao5+(ao5, ao12 and ao100 mainly) but its very slow
export const generateBestAo5Plus = (data: string[], base: number): string => {
    if (base < 5) throw new Error("base needs to be at least 5");
    if (data.length < 5) throw new Error("there needs to be at least 5 solves");

    const dismissPerSide = Math.ceil((5 / 100) * base);

    // there are different methods (some are fast but not accurate)
    const calculateFindBestWorst = (position: number) => {
        const minIndexes = new Map();
        const maxIndexes = new Map<number, boolean>();
        for (let i = 0; i < dismissPerSide; i++) {
            let min = "0.00";
            let minIndex = 0;
            let max = "dnf";
            let maxIndex = 0;
            for (let j = position; j < position + base; j++) {
                let continueMin = true;
                if (minIndexes.has(j)) {
                    continueMin = false;
                }
                if (continueMin) {
                    if (data[j] === "dnf") {
                        min = "dnf";
                        minIndex = j;
                        continueMin = false;
                    }
                }
                if (continueMin) {
                    if (min === "dnf") {
                        continueMin = false;
                    }
                }
                if (continueMin) {
                    if (Number(data[j]) > Number(min)) {
                        min = data[j];
                        minIndex = j;
                    }
                }
                let continueMax = true;
                if (maxIndexes.has(j)) {
                    continueMax = false;
                }
                if (continueMax) {
                    if (data[j] === "dnf") {
                        continueMax = false;
                    }
                }
                if (continueMax) {
                    if (max === "dnf") {
                        max = data[j];
                        maxIndex = j;
                        continueMax = false;
                    }
                }
                if (continueMax) {
                    if (Number(data[j]) < Number(max)) {
                        max = data[j];
                        maxIndex = j;
                    }
                }
            }
            minIndexes.set(minIndex, true);
            maxIndexes.set(maxIndex, true);
        }
        let sum = 0;
        for (let j = position; j < position + base; j++) {
            if (maxIndexes.has(j) || minIndexes.has(j)) {
                continue;
            }
            if (data[j] === "dnf") return "dnf";
            sum += Number(data[j]);
        }
        return String(sum / (base - dismissPerSide * 2));
    };

    const calculateSort = (position: number) => {
        const sortedData = data
            .slice(position, position + base)
            .sort((a, b) => {
                if (a === "dnf") return 1;
                if (b === "dnf") return -1;
                return Number(a) - Number(b);
            });
        let sum = 0;
        if (sortedData[base - dismissPerSide - 1] === "dnf") return "dnf";
        for (let i = dismissPerSide; i < base - dismissPerSide; i++) {
            sum += Number(sortedData[i]);
        }
        return String(sum / (base - dismissPerSide * 2));
    };

    const calculate = (position: number) => {
        let validTimesNum = 0;
        let validTimesSum = 0;
        for (let solve = position; solve < position + base; solve++) {
            if (data[solve] != "dnf") {
                validTimesNum++;
                validTimesSum += Number(data[solve]);
            }
        }
        if (validTimesNum < base - dismissPerSide * 2) return "dnf";
        return String(validTimesSum / validTimesNum);
    };

    let answer = "none";
    for (let i = 0; i < data.length; i++) {
        if (data.length - i < base) break;
        const current = calculate(i);
        if (answer === "none") {
            answer = current;
            continue;
        }
        if (current === "dnf") continue;
        if (answer === "dnf") {
            answer = current;
            continue;
        }
        if (Number(current) < Number(answer)) answer = current;
    }

    if (answer === "none") return "none";
    if (answer === "dnf") return "dnf";
    return Number(answer).toFixed(2);
};
