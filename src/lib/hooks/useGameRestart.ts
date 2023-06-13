"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

import {
    accuracyAtom,
    currentCharIndexAtom,
    currentWordAtom,
    errorIndexAtom,
    inputAtom,
    progressAtom,
    startTimeAtom,
    totalDurationAtom,
    wpmAtom,
} from "../atoms";

export function useGameRestart() {
    const input = useAtomValue(inputAtom);

    const setProgress = useSetAtom(progressAtom);
    const setStartTime = useSetAtom(startTimeAtom);
    const setCurrentWord = useSetAtom(currentWordAtom);
    const setCurrentCharIndex = useSetAtom(currentCharIndexAtom);
    const setErrorIndex = useSetAtom(errorIndexAtom);
    const setWpm = useSetAtom(wpmAtom);
    const setAuccuracy = useSetAtom(accuracyAtom);
    const setTotalDuration = useSetAtom(totalDurationAtom);

    const restart = useCallback(() => {
        if (input) {
            input.value = "";
        }
        // setIsStart(false);
        setAuccuracy(0);
        setCurrentCharIndex(0);
        setCurrentWord(0);
        setStartTime(null);
        setWpm(0);
        setTotalDuration(0);
        setProgress("PENDING");
        setErrorIndex([]);
    }, [
        input,
        setAuccuracy,
        setCurrentCharIndex,
        setCurrentWord,
        setErrorIndex,
        setProgress,
        setStartTime,
        setTotalDuration,
        setWpm,
    ]);

    return { restart };
}
