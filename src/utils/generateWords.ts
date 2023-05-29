import { faker } from "@faker-js/faker";

export function generateWords({ count = 10 }: { count: number }): string {
    const generatedWordsString = faker.word.words({ count });
    return generatedWordsString;
}
