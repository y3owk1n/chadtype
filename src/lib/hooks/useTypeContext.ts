"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { useKeyPress } from "./useKeyPress";

const ignoreKeys = [
    "Shift",
    "Meta",
    "Alt",
    "Control",
    "Escape",
    "Tab",
    "ArrowDown",
    "ArrowUp",
    "ArrowRight",
    "ArrowLeft",
];

export function useTypeContext({ text }: { text: string }) {
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

    useKeyPress((key) => {
        if (!startTyping && key === "Enter") {
            setStartTyping(true);
        }

        if (isTypingEnd()) return;

        if (!startTime) setStartTime(currentTime());

        const currentChar = text[currentCharIndex];

        if (startTime && startTyping && !ignoreKeys.includes(key)) {
            // Set errors
            if (key.length === 1 && key !== currentChar) {
                setErrorIndex((prev) => [...prev, currentCharIndex]);
            }

            // Set complete single words with space
            if (key === " ") {
                setCurrentWord((prev) => prev + 1);
            }

            // Handle backspace
            if (currentCharIndex > 0 && key === "Backspace") {
                if (text[currentCharIndex] === " ") {
                    if (currentWord > 0) {
                        setCurrentWord((prev) => prev - 1);
                    }
                }
                setCurrentCharIndex((prev) => prev - 1);
                handleErrors();
            } else {
                setCurrentCharIndex((prev) => prev + 1);
            }

            const durationInMinutes = (currentTime() - startTime) / 60000.0;

            const wpm = currentCharIndex / durationInMinutes / 5;

            setWpm(wpm);
            setAuccuracy(calculateAccuracy());
            setTotalDuration(durationInMinutes);
        }
    });

    const handleRestart = () => {
        setAuccuracy(0);
        setCurrentCharIndex(0);
        setCurrentWord(0);
        setStartTime(null);
        setWpm(0);
        setTotalDuration(0);
        setStartTyping(false);
        setErrorIndex([]);
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
        wordsBeforeCurrentCharacter,
        currentCharacter,
        wordsAfterCurrentCharacter,
        isTypingEnd,
        wpm,
        accuracy: accuracy.toFixed(2),
        totalDuration: totalDuration.toFixed(2),
        handleRestart,
        startTyping,
        errorIndexBeforeCurrentCharacter,
    };
}
