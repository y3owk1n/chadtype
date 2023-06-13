"use client";

import {
    focusAtom,
    inputAtom,
    progressAtom,
    wordsBeforeCurrentCharacterAtom,
    wordsAfterCurrentCharacterAtom,
    errorIndexBeforeCurrentCharacterAtom,
    currentCharIndexAtom,
    typingTextAtom,
    type GenerateWordsSchema,
    startTimeAtom,
    wpmAtom,
    accuracyAtom,
    totalDurationAtom,
    errorIndexAtom,
    currentWordAtom,
    getRandomWords,
} from "@/lib";
import { useInputFocus, useKeyPress, usePageLeave, useCountdown } from "@/lib";
import { cn } from "@/utils";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface TypingLinesProps {
    mode: GenerateWordsSchema["mode"];
    timeCount: GenerateWordsSchema['timeCount']
}

export function TypingLines({ mode, timeCount }: TypingLinesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useAtom(inputAtom);

    const [progress, setProgress] = useAtom(progressAtom);
    const [startTime, setStartTime] = useAtom(startTimeAtom);
    const [currentWord, setCurrentWord] = useAtom(currentWordAtom);
    const [currentCharIndex, setCurrentCharIndex] =
        useAtom(currentCharIndexAtom);
    const [errorIndex, setErrorIndex] = useAtom(errorIndexAtom);
    const [isFocus, setIsFocus] = useAtom(focusAtom);

    const [typingText, setTypingText] = useAtom(typingTextAtom);

    const wordsBeforeCurrentCharacter = useAtomValue(
        wordsBeforeCurrentCharacterAtom
    );

    const wordsAfterCurrentCharacter = useAtomValue(
        wordsAfterCurrentCharacterAtom
    );

    const errorIndexBeforeCurrentCharacter = useAtomValue(
        errorIndexBeforeCurrentCharacterAtom
    );


    const setWpm = useSetAtom(wpmAtom);
    const setAuccuracy = useSetAtom(accuracyAtom);
    const setTotalDuration = useSetAtom(totalDurationAtom);

    const currentCharacter = typingText[currentCharIndex || 0];

    const { ref } = useInView({
        root: containerRef.current,
        rootMargin: "0px 0px -50px 0px",
        onChange: (inView, entry) => {
            if (!inView && containerRef.current) {
                const lineHeight = entry.boundingClientRect.height;
                containerRef.current.scrollTop -=
                    containerRef.current.getBoundingClientRect().y -
                    entry.boundingClientRect.y +
                    lineHeight;
            }
        },
    });

    const currentTime = useCallback(() => {
        return new Date().getTime();
    }, []);


    const { setIsStart } = useCountdown({
        duration: Number(timeCount) * 1000,
        options: {
            interval: 1000,
            onTick: () => {
                return;
            },
            onComplete: () => {
                if (input) {
                    setProgress("END");
                    input.disabled = true;
                    setIsStart(false);
                }
            },
        },
    });


    const startTypingGame = useCallback(() => {
        if (input && progress === "PENDING") {
            if (mode === "time") {
                setIsStart(true);
            }
            setProgress("STARTED");
            setStartTime(currentTime());
            input.disabled = false;
            input.focus();
        }
    }, [currentTime, input, mode, progress, setIsStart, setProgress, setStartTime]);

    const calculateAccuracy = useCallback(() => {
        return (
            ((typingText.length - errorIndex.length) / typingText.length) * 100
        );
    }, [errorIndex.length, typingText.length]);

    const handleErrors = useCallback(() => {
        const matchedError = errorIndex.find(
            (errorIdx) => errorIdx === currentCharIndex - 1
        );
        if (matchedError !== undefined) {
            const updatedError = errorIndex.filter(
                (error) => error !== matchedError
            );
            setErrorIndex(updatedError);
        }
    }, [currentCharIndex, errorIndex, setErrorIndex]);


        const inputCharArr: string[] = input?.value.split("") || [];

        const inputCharLength = inputCharArr.length;
        const lastIndex = inputCharLength - 1;

        const latestChar = inputCharArr[currentCharIndex];

        const currentChar = typingText[currentCharIndex];

    const getMoreWords = useCallback(async () => {

        const newWords = await getRandomWords({
            numberOfWords: 30,
            mode: "time",
        });
        setTypingText(typingText + " " + newWords.sectionText);
        return;
    }, [setTypingText, typingText])


    useEffect(() => {
        if (!startTime || progress === "PENDING") {
            if (input) {
                input.disabled = true;
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
            if (input) {
                setProgress("END");
                input.disabled = true;
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
    }, [startTime, progress, currentCharIndex, typingText, currentWord, currentTime, calculateAccuracy, mode, input, handleErrors, setWpm, setAuccuracy, setTotalDuration, setProgress, setCurrentCharIndex, setCurrentWord, setErrorIndex, latestChar, inputCharLength, currentChar, lastIndex, getMoreWords]);


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
        elementRef: input,
    });

    return (
        <>
            <input
                ref={setInput}
                className="sr-only" // Probably no one would use a screenreader to play typing game?
                spellCheck={false}
                tabIndex={0}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                list="autocompleteOff"
                data-ddg-inputtype="unknown"
            />
            <div
                ref={containerRef}
                onClick={startTypingGame}
                className="relative h-24 overflow-hidden font-mono text-2xl"
            >
                {!isFocus && progress === "STARTED" && (
                    <div
                        onClick={() => {
                            input?.focus();
                        }}
                        className="absolute left-0 top-0 grid h-full w-full place-items-center text-center backdrop-blur-sm"
                    >
                        Click here to continue typing
                    </div>
                )}
                {wordsBeforeCurrentCharacter.length > 0 &&
                    wordsBeforeCurrentCharacter.map((word, index) => {
                        const isErrorWord =
                            errorIndexBeforeCurrentCharacter.find(
                                (errorIndex) =>
                                    errorIndex === index && word !== " "
                            ) !== undefined;
                        const isErrorSpace =
                            errorIndexBeforeCurrentCharacter.find(
                                (errorIndex) =>
                                    errorIndex === index && word === " "
                            ) !== undefined;
                        return (
                            <span
                                key={`${word}-${index}`}
                                className={cn(
                                    "text-gray-800 dark:text-gray-300",
                                    isErrorWord &&
                                        "text-red-500 dark:text-red-300",
                                    isErrorSpace &&
                                        "border-b border-red-500 dark:border-red-300"
                                )}
                            >
                                {word}
                            </span>
                        );
                    })}
                <span
                    ref={ref}
                    className={cn(
                        " text-gray-300 dark:text-gray-800",
                        progress === "STARTED" && isFocus ? "animate-blink" : ""
                    )}
                >
                    {currentCharacter}
                </span>

                {wordsAfterCurrentCharacter.length > 0 &&
                    wordsAfterCurrentCharacter.map((word, index) => (
                        <span
                            key={`${word}-${index}`}
                            className={cn("text-gray-300 dark:text-gray-800")}
                        >
                            {word}
                        </span>
                    ))}
            </div>
        </>
    );
}
