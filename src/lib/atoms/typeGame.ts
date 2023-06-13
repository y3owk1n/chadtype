"use client";

import { atom } from "jotai";

export const inputAtom = atom<HTMLInputElement | null>(null);

export const typingTextAtom = atom<string>("");

// Indicate whether game is started
export const progressAtom = atom<"PENDING" | "STARTED" | "END">("PENDING");

// Track on start and end time
export const startTimeAtom = atom<number | null>(null);

export const focusAtom = atom(false);

export const currentCharIndexAtom = atom(0);
export const currentWordAtom = atom(0);

export const errorIndexAtom = atom<number[]>([]);

export const totalDurationAtom = atom(0);

export const accuracyAtom = atom(0);
export const wpmAtom = atom(0);

export const wpmArrAtom = atom<number[]>([]);

export const wordsBeforeCurrentCharacterAtom = atom((get) => {
    const typingText = get(typingTextAtom);
    const currentCharIndex = get(currentCharIndexAtom);

    return typingText.substring(0, currentCharIndex || 0).split("");
});

export const wordsAfterCurrentCharacterAtom = atom((get) => {
    const typingText = get(typingTextAtom);
    const currentCharIndex = get(currentCharIndexAtom);

    return typingText.substring(currentCharIndex + 1).split("");
});

export const errorIndexBeforeCurrentCharacterAtom = atom((get) => {
    const errorIndex = get(errorIndexAtom);
    const currentCharIndex = get(currentCharIndexAtom);

    return errorIndex.filter((error) => error <= currentCharIndex);
});
