"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useKeyPress } from "./useKeyPress";

export function useTypeContext({ text }: { text: string }) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentWord, setCurrentWord] = useState(0);
    const [startTyping, setStartTyping] = useState(false);
    const router = useRouter();

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

    const isTypingEnd = useCallback(() => {
        return currentCharIndex === text.length;
    }, [currentCharIndex, text.length]);

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

    const inputCharArr: string[] = inputRef.current?.value.split("") || [];

    const inputCharLength = inputCharArr.length;
    const lastIndex = inputCharLength - 1;

    const latestChar = inputCharArr[currentCharIndex];

    const currentChar = text[currentCharIndex];

    useEffect(() => {
        if (!startTime || !startTyping) {
            if (inputRef.current) {
                inputRef.current.disabled = true;
            }
            return;
        }

        const durationInMinutes = (currentTime() - startTime) / 60000.0;

        const wpm = currentCharIndex / durationInMinutes / 5;

        setWpm(wpm);
        setAuccuracy(calculateAccuracy());
        setTotalDuration(durationInMinutes);

        // If havent start typing yet
        if (!latestChar && inputCharLength === currentCharIndex) return;

        // If finished typing
        if (inputCharLength === text.length) {
            if (inputRef.current) {
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
        startTyping,
        currentCharIndex,
        latestChar,
        inputCharLength,
        text,
        currentChar,
        currentWord,
        lastIndex,
    ]);

    useKeyPress((key) => {
        // Press enter key to start
        if (!startTyping && key === "Enter") {
            if (inputRef.current) {
                setStartTyping(true);
                setStartTime(currentTime());
                inputRef.current.disabled = false;
                inputRef.current.focus();
            }
        }
    });

    const restart = () => {
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        setAuccuracy(0);
        setCurrentCharIndex(0);
        setCurrentWord(0);
        setStartTime(null);
        setWpm(0);
        setTotalDuration(0);
        setStartTyping(false);
        setErrorIndex([]);
    };

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
        wordsBeforeCurrentCharacter,
        currentCharacter,
        wordsAfterCurrentCharacter,
        isTypingEnd,
        wpm,
        currentCharIndex,
        accuracy: accuracy.toFixed(2),
        totalDuration: totalDuration.toFixed(2),
        handleRestart,
        startTyping,
        errorIndexBeforeCurrentCharacter,
        restart,
    };
}
