"use client";

import { useTypeContext } from "@/lib";
import { cn } from "@/utils";

import { Button } from "../atoms";

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
    } = useTypeContext({ count });

    return (
        <div>
            <div className="grid gap-4">
                <p className="font-mono text-lg">
                    <span className="text-gray-800">
                        {wordsBeforeCurrentCharacter}
                    </span>
                    <span
                        className={cn(
                            " text-gray-300",
                            isTypingEnd()
                                ? ""
                                : "animate-blink border-l-2 border-blue-500"
                        )}
                    >
                        {currentCharacter}
                    </span>
                    <span className="text-gray-300">
                        {wordsAfterCurrentCharacter}
                    </span>
                </p>
                {isTypingEnd() && (
                    <Button
                        size="sm"
                        className="mx-auto w-fit"
                        onClick={handleRestart}
                    >
                        Restart
                    </Button>
                )}
            </div>
            WPM: {wpm.toFixed(2)}
            Accuracy: {accuracy}%<span>time: {totalDuration} mins</span>
        </div>
    );
}
