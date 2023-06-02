"use client";

import { type useTypeContext } from "@/lib";

import { Badge } from "../atoms";

interface TypingStatisticsProps {
    text: string;
    wpm: ReturnType<typeof useTypeContext>["wpm"];
    accuracy: ReturnType<typeof useTypeContext>["accuracy"];
    totalDuration: ReturnType<typeof useTypeContext>["totalDuration"];
    currentCharIndex: ReturnType<typeof useTypeContext>["currentCharIndex"];
}

export function TypingStatistics({
    text,
    wpm,
    accuracy,
    totalDuration,
    currentCharIndex,
}: TypingStatisticsProps) {
    return (
        <>
            <div className="mx-auto flex flex-wrap items-center justify-center gap-2">
                <Badge
                    className="w-fit text-xs text-gray-500"
                    variant="outline"
                >
                    WPM: {wpm.toFixed(2)}
                </Badge>
                <Badge
                    className="w-fit text-xs text-gray-500"
                    variant="outline"
                >
                    Accuracy: {accuracy}%
                </Badge>
                <Badge
                    className="w-fit text-xs text-gray-500"
                    variant="outline"
                >
                    Time: {totalDuration} mins
                </Badge>
                <Badge
                    className="w-fit text-xs text-gray-500"
                    variant="outline"
                >
                    Characters: {currentCharIndex} / {text.length}
                </Badge>
            </div>
        </>
    );
}
