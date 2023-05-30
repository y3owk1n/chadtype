"use client";

import { generateWords } from "@/utils";
import { useCallback, useState } from "react";

import { useKeyPress } from "./useKeyPress";

export function useTypeContext({ count }: { count: number }) {
    const [words, setWords] = useState(generateWords({ count }));
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentWord, setCurrentWord] = useState(0);
    const [startTyping, setStartTyping] = useState(false);

    const [errorIndex, setErrorIndex] = useState<number[]>([]);

    const [totalDuration, setTotalDuration] = useState(0);

    const [accuracy, setAuccuracy] = useState(0);
    const [wpm, setWpm] = useState(0);

    const currentTime = useCallback(() => {
        return new Date().getTime();
    }, []);

    const calculateAccuracy = useCallback(() => {
        return ((words.length - errorIndex.length) / words.length) * 100;
    }, [errorIndex.length, words.length]);

    const isTypingEnd = useCallback(() => {
        return currentCharIndex === words.length;
    }, [currentCharIndex, words.length]);

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

        const currentChar = words[currentCharIndex];

        if (startTime && startTyping) {
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
                if (words[currentCharIndex] === " ") {
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
        setWords(generateWords({ count }));
        setTotalDuration(0);
        setStartTyping(false);
        setErrorIndex([]);
    };

    const wordsBeforeCurrentCharacter = words
        .substring(0, currentCharIndex || 0)
        .split("");
    const errorIndexBeforeCurrentCharacter = errorIndex.filter(
        (error) => error < currentCharIndex
    );
    const currentCharacter = words[currentCharIndex || 0];
    const wordsAfterCurrentCharacter = words
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
