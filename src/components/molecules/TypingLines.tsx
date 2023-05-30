"use client";

import { useTypeContext } from "@/lib";
import { cn } from "@/utils";
import { RotateCw } from "lucide-react";

import { Badge, Button } from "../atoms";

const count = 10;

export function TypingLines() {
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
    } = useTypeContext({ count });

    return (
        <div className="grid max-w-2xl gap-8 ">
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

                <p className="font-mono text-lg">
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
                </p>
            </div>
            <div className="mx-auto flex items-center gap-2">
                <Badge
                    className="w-fit"
                    variant="outline"
                >
                    wpm: {wpm.toFixed(2)}
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
                    time: {totalDuration} mins
                </Badge>
            </div>
            {(isTypingEnd() || startTyping) && (
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
