"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { getRandomWords, type GenerateWordsSchema } from "../queries";
import { useCountdown } from "./useCountdown";
import { useInputFocus } from "./useInputFocus";
import { useKeyPress } from "./useKeyPress";
import { usePageLeave } from "./usePageLeave";

interface TypeContextOptions {
    text: string;
    mode: GenerateWordsSchema["mode"];
    timeCount: string;
}

export function useTypeContext({
    text: initialText,
    mode,
    timeCount,
}: TypeContextOptions) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const [typingText, setTypingText] = useState(initialText);

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
        return (
            ((typingText.length - errorIndex.length) / typingText.length) * 100
        );
    }, [errorIndex.length, typingText.length]);

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

    const { count, setIsStart } = useCountdown({
        duration: Number(timeCount) * 1000,
        options: {
            interval: 1000,
            onTick: () => {
                return;
            },
            onComplete: () => {
                if (inputRef.current) {
                    setProgress("END");
                    inputRef.current.disabled = true;
                }
            },
        },
    });

    const startTypingGame = useCallback(() => {
        if (inputRef.current && progress === "PENDING") {
            if (mode === "time") {
                setIsStart(true);
            }
            setProgress("STARTED");
            setStartTime(currentTime());
            inputRef.current.disabled = false;
            inputRef.current.focus();
        }
    }, [currentTime, mode, progress, setIsStart]);

    const restart = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        setIsStart(false);
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

    const currentChar = typingText[currentCharIndex];

    const getMoreWords = async () => {
        const newWords = await getRandomWords({
            numberOfWords: 30,
            mode: "time",
        });
        setTypingText((prev) => prev + " " + newWords.sectionText);
        return;
    };

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
        if (inputCharLength === typingText.length) {
            if (inputRef.current) {
                setProgress("END");
                inputRef.current.disabled = true;
            }
        }

        // If mode is time
        if (mode === "time") {
            if (typingText.length - inputCharLength === 15 * 5) {
                getMoreWords().catch((err) => console.log(err));
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
        typingText,
        currentChar,
        currentWord,
        lastIndex,
    ]);

    useKeyPress((key) => {
        // Press enter key to start
        if (key === "Enter") {
            startTypingGame();
        }
    });

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

    const wordsBeforeCurrentCharacter = typingText
        .substring(0, currentCharIndex || 0)
        .split("");
    const errorIndexBeforeCurrentCharacter = errorIndex.filter(
        (error) => error < currentCharIndex
    );
    const currentCharacter = typingText[currentCharIndex || 0];
    const wordsAfterCurrentCharacter = typingText
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
        typingText,
        count,
    };
}
