export function getRandomEntryfromArray<T>(entries: T[]): T | undefined {
    if (entries.length === 0) {
        return undefined;
    }

    const randomIndex = Math.floor(Math.random() * entries.length);
    return entries[randomIndex];
}
