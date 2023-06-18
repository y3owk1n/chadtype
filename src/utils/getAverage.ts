export function getAverage(numbers: number[]): number {
    if (numbers.length <= 0) {
        return 0;
    }
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return sum / numbers.length;
}
