"use client";

import { useTypeContext } from "@/lib";
import { cn } from "@/utils";
import { RotateCw } from "lucide-react";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";

import { Badge, Button } from "../atoms";

interface TypingLinesProps {
    text: string;
}

export function TypingLines({ text }: TypingLinesProps) {
    const {
        wordsBeforeCurrentCharacter,
        currentCharacter,
        wordsAfterCurrentCharacter,
        wpm,
        accuracy,
        totalDuration,
        handleRestart,
        isTypingEnd,
        startTyping,
        errorIndexBeforeCurrentCharacter,
    } = useTypeContext({ text });

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
        <div className="grid max-w-4xl gap-8 ">
            <div className="grid gap-8">
                {startTyping || !isTypingEnd ? (
                    <p className="text-xs text-gray-500">
                        🚀 Type as fast as you can!
                    </p>
                ) : (
                    <p className={cn("text-xs text-gray-500")}>
                        Press{" "}
                        <Badge
                            className="text-xs text-gray-500"
                            variant="outline"
                        >
                            Enter
                        </Badge>{" "}
                        to start
                    </p>
                )}

                <div
                    ref={containerRef}
                    className="h-24 overflow-hidden font-mono text-2xl"
                >
                    {wordsBeforeCurrentCharacter.length > 0 &&
                        wordsBeforeCurrentCharacter.map((word, index) => (
                            <span
                                key={`${word}-${index}`}
                                className={cn(
                                    "text-gray-800",
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
                            " text-gray-300",
                            isTypingEnd() || !startTyping
                                ? ""
                                : "animate-blink border-l-2 border-blue-500"
                        )}
                    >
                        {currentCharacter}
                    </span>

                    {wordsAfterCurrentCharacter.length > 0 &&
                        wordsAfterCurrentCharacter.map((word, index) => (
                            <span
                                key={`${word}-${index}`}
                                className={cn("text-gray-300")}
                            >
                                {word}
                            </span>
                        ))}
                </div>
            </div>
            <div className="mx-auto flex items-center gap-2">
                <Badge
                    className="w-fit"
                    variant="outline"
                >
                    WPM: {wpm.toFixed(2)}
                </Badge>
                <Badge
                    className="w-fit"
                    variant="outline"
                >
                    Accuracy: {accuracy}%
                </Badge>
                <Badge
                    className="w-fit"
                    variant="outline"
                >
                    Time: {totalDuration} mins
                </Badge>
                <Badge
                    className="w-fit"
                    variant="outline"
                >
                    Words: {text.length}
                </Badge>
            </div>
            {isTypingEnd() && (
                <Button
                    aria-label="Restart"
                    size="sm"
                    className="mx-auto w-fit"
                    onClick={handleRestart}
                    variant="ghost"
                >
                    <RotateCw className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
