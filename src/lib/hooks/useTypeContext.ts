"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { type GenerateWordsSchema } from "../queries";
import { useHotkeys } from "./useHotKeys";
import { useInputFocus } from "./useInputFocus";
import { useKeyPress } from "./useKeyPress";
import { usePageLeave } from "./usePageLeave";

interface TypeContextOptions {
    text: string;
    mode: GenerateWordsSchema["mode"];
}

export function useTypeContext({ text, mode }: TypeContextOptions) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Indicate whether game is started
    const [progress, setProgress] = useState<"PENDING" | "STARTED" | "END">(
        "PENDING"
    );

    // Track on start and end time
    const [startTime, setStartTime] = useState<number | null>(null);

    const [isFocus, setIsFocus] = useState(false);

    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [currentWord, setCurrentWord] = useState(0);

    const [errorIndex, setErrorIndex] = useState<number[]>([]);

    const [totalDuration, setTotalDuration] = useState(0);

    const [accuracy, setAuccuracy] = useState(0);
    const [wpm, setWpm] = useState(0);

    const currentTime = useCallback(() => {
        return new Date().getTime();
    }, []);

    const calculateAccuracy = useCallback(() => {
        return ((text.length - errorIndex.length) / text.length) * 100;
    }, [errorIndex.length, text.length]);

    const handleErrors = useCallback(() => {
        const matchedError = errorIndex.find(
            (errorIdx) => errorIdx === currentCharIndex - 1
        );
        if (matchedError) {
            const updatedError = errorIndex.filter(
                (error) => error !== matchedError
            );
            setErrorIndex(updatedError);
        }
    }, [currentCharIndex, errorIndex]);

    const startTypingGame = useCallback(() => {
        if (inputRef.current && progress === "PENDING") {
            setProgress("STARTED");
            setStartTime(currentTime());
            inputRef.current.disabled = false;
            inputRef.current.focus();
        }
    }, [currentTime, progress]);

    const restart = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        setAuccuracy(0);
        setCurrentCharIndex(0);
        setCurrentWord(0);
        setStartTime(null);
        setWpm(0);
        setTotalDuration(0);
        setProgress("PENDING");
        setErrorIndex([]);
    }, []);

    const inputCharArr: string[] = inputRef.current?.value.split("") || [];

    const inputCharLength = inputCharArr.length;
    const lastIndex = inputCharLength - 1;

    const latestChar = inputCharArr[currentCharIndex];

    const currentChar = text[currentCharIndex];

    useEffect(() => {
        if (!startTime || progress === "PENDING") {
            if (inputRef.current) {
                inputRef.current.disabled = true;
            }
            return;
        }

        // If havent start typing yet
        if (!latestChar && inputCharLength === currentCharIndex) return;

        const durationInMinutes = (currentTime() - startTime) / 60000.0;
        const wpm = currentCharIndex / durationInMinutes / 5;
        setWpm(wpm);
        setAuccuracy(calculateAccuracy());
        setTotalDuration(durationInMinutes);

        // If finished typing
        if (inputCharLength === text.length) {
            if (inputRef.current) {
                setProgress("END");
                inputRef.current.disabled = true;
            }
        }

        // If typing...
        if (inputCharLength < currentCharIndex) {
            // backspace mode
            if (currentChar === " ") {
                if (currentWord > 0) {
                    setCurrentWord((prev) => prev - 1);
                }
            }
            setCurrentCharIndex((prev) => prev - 1);
            handleErrors();
        } else {
            // forward mode
            setCurrentCharIndex(lastIndex + 1);

            if (latestChar !== currentChar) {
                setErrorIndex((prev) => [...prev, currentCharIndex]);
                return;
            }

            // Set complete single words with space
            if (latestChar === " ") {
                setCurrentWord((prev) => prev + 1);
                return;
            }
        }

        return;
    }, [
        startTime,
        progress,
        currentCharIndex,
        latestChar,
        inputCharLength,
        text,
        currentChar,
        currentWord,
        lastIndex,
    ]);

    useHotkeys([["mod+Enter", startTypingGame]]);

    usePageLeave(() => {
        setIsFocus(false);
    });

    useInputFocus({
        setBlurCb: () => setIsFocus(false),
        setFocusCb: () => setIsFocus(true),
        elementRef: inputRef,
    });

    const handleRestart = () => {
        restart();
        router.refresh();
    };

    const wordsBeforeCurrentCharacter = text
        .substring(0, currentCharIndex || 0)
        .split("");
    const errorIndexBeforeCurrentCharacter = errorIndex.filter(
        (error) => error < currentCharIndex
    );
    const currentCharacter = text[currentCharIndex || 0];
    const wordsAfterCurrentCharacter = text
        .substring(currentCharIndex + 1)
        .split("");

    return {
        inputRef,
        isFocus,
        wordsBeforeCurrentCharacter,
        currentCharacter,
        wordsAfterCurrentCharacter,
        wpm,
        currentCharIndex,
        accuracy: accuracy.toFixed(2),
        totalDuration: totalDuration.toFixed(2),
        handleRestart,
        progress,
        errorIndexBeforeCurrentCharacter,
        restart,
        startTypingGame,
    };
}
