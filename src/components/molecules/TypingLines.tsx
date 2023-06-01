"use client";

import { type useTypeContext } from "@/lib";
import { cn } from "@/utils";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";

interface TypingLinesProps {
    wordsBeforeCurrentCharacter: ReturnType<
        typeof useTypeContext
    >["wordsAfterCurrentCharacter"];
    currentCharacter: ReturnType<typeof useTypeContext>["currentCharacter"];
    wordsAfterCurrentCharacter: ReturnType<
        typeof useTypeContext
    >["wordsAfterCurrentCharacter"];
    isTypingEnd: ReturnType<typeof useTypeContext>["isTypingEnd"];
    startTyping: ReturnType<typeof useTypeContext>["startTyping"];
    errorIndexBeforeCurrentCharacter: ReturnType<
        typeof useTypeContext
    >["errorIndexBeforeCurrentCharacter"];
}

export function TypingLines({
    wordsBeforeCurrentCharacter,
    currentCharacter,
    wordsAfterCurrentCharacter,
    isTypingEnd,
    startTyping,
    errorIndexBeforeCurrentCharacter,
}: TypingLinesProps) {
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

    return (
        <>
            <div
                ref={containerRef}
                className="h-24 overflow-hidden font-mono text-2xl"
            >
                {wordsBeforeCurrentCharacter.length > 0 &&
                    wordsBeforeCurrentCharacter.map((word, index) => (
                        <span
                            key={`${word}-${index}`}
                            className={cn(
                                "text-gray-800 dark:text-gray-300",
                                errorIndexBeforeCurrentCharacter.find(
                                    (errorIndex) =>
                                        errorIndex === index && word !== " "
                                ) && "text-red-500",
                                errorIndexBeforeCurrentCharacter.find(
                                    (errorIndex) =>
                                        errorIndex === index && word === " "
                                ) && "bg-red-500"
                            )}
                        >
                            {word}
                        </span>
                    ))}
                <span
                    ref={ref}
                    className={cn(
                        " text-gray-300 dark:text-gray-800",
                        isTypingEnd() || !startTyping ? "" : "animate-blink"
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
