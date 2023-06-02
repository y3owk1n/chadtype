"use client";

import { type useTypeContext } from "@/lib";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface TypingLinesProps {
    startTypingGame: ReturnType<typeof useTypeContext>["startTypingGame"];
    inputRef: ReturnType<typeof useTypeContext>["inputRef"];
    wordsBeforeCurrentCharacter: ReturnType<
        typeof useTypeContext
    >["wordsAfterCurrentCharacter"];
    currentCharacter: ReturnType<typeof useTypeContext>["currentCharacter"];
    wordsAfterCurrentCharacter: ReturnType<
        typeof useTypeContext
    >["wordsAfterCurrentCharacter"];
    progress: ReturnType<typeof useTypeContext>["progress"];
    errorIndexBeforeCurrentCharacter: ReturnType<
        typeof useTypeContext
    >["errorIndexBeforeCurrentCharacter"];
}

export function TypingLines({
    startTypingGame,
    inputRef,
    wordsBeforeCurrentCharacter,
    currentCharacter,
    wordsAfterCurrentCharacter,
    progress,
    errorIndexBeforeCurrentCharacter,
}: TypingLinesProps) {
    const [isFocus, setIsFocus] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleFocus = () => {
            // Element has gained focus
            setIsFocus(true);
        };

        const handleBlur = () => {
            // Element has lost focus
            setIsFocus(false);
        };

        const element = inputRef.current;

        if (element) {
            element.addEventListener("focus", handleFocus);
            element.addEventListener("blur", handleBlur);
        }

        return () => {
            if (element) {
                element.removeEventListener("focus", handleFocus);
                element.removeEventListener("blur", handleBlur);
            }
        };
    }, [inputRef]);

    const handleStartGame = () => {
        startTypingGame();
        inputRef.current?.focus();

        return;
    };

    return (
        <>
            <input
                ref={inputRef}
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
                onClick={handleStartGame}
                className="relative h-24 overflow-hidden font-mono text-2xl"
            >
                {!isFocus && progress === "STARTED" && (
                    <div
                        onClick={() => {
                            inputRef.current?.focus();
                        }}
                        className="absolute left-0 top-0 grid h-full w-full place-items-center backdrop-blur-sm"
                    >
                        Click here to continue typing
                    </div>
                )}
                {wordsBeforeCurrentCharacter.length > 0 &&
                    wordsBeforeCurrentCharacter.map((word, index) => (
                        <span
                            key={`${word}-${index}`}
                            className={cn(
                                "text-gray-800 dark:text-gray-300",
                                errorIndexBeforeCurrentCharacter.find(
                                    (errorIndex) =>
                                        errorIndex === index && word !== " "
                                ) && "text-red-500 dark:text-red-300",
                                errorIndexBeforeCurrentCharacter.find(
                                    (errorIndex) =>
                                        errorIndex === index && word === " "
                                ) &&
                                    "border-b border-red-500 dark:border-red-300"
                            )}
                        >
                            {word}
                        </span>
                    ))}
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
