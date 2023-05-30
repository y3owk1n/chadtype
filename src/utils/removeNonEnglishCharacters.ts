export function removeNonEnglishCharacters(sentence: string): string {
    const nonEnglishCharacters = /[^a-zA-Z0-9\s.,!?'"()\-\u2013]/g;
    const filteredSentence = sentence.replace(nonEnglishCharacters, "");
    return filteredSentence;
}
