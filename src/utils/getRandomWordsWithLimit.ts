interface ArrayType {
    text: string;
}
export function getRandomWordsWithLimit(
    array: ArrayType[],
    count: number
): ArrayType[] {
    const randomWords: ArrayType[] = [];

    // Fill the reservoir with the first 'count' elements
    for (let i = 0; i < count; i++) {
        randomWords[i] = array[i];
    }

    // Replace elements in the reservoir with decreasing probability
    for (let i = count; i < array.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));

        // If j is within the range of the reservoir, replace the element
        if (j < count) {
            randomWords[j] = array[i];
        }
    }

    return randomWords;
}
