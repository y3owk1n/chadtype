interface ArrayType {
    text: string;
}
export function getRandomWordsWithLimit(
    array: ArrayType[],
    count: number
): ArrayType[] {
    const randomWords: ArrayType[] = array.slice(0, count);

    for (let i = count; i < array.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));

        if (j < count) {
            randomWords[j] = array[i] as ArrayType;
        }
    }

    return randomWords;
}
