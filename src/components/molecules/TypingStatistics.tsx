"use client";

import {
    typingTextAtom,
    accuracyAtom,
    totalDurationAtom,
    currentCharIndexAtom,
    averageWpmAtom,
} from "@/lib";
import { useAtomValue } from "jotai";

import { Badge } from "../atoms";

export function TypingStatistics() {
    const typingText = useAtomValue(typingTextAtom);
    const averageWpm = useAtomValue(averageWpmAtom);
    const accuracy = useAtomValue(accuracyAtom);
    const totalDuration = useAtomValue(totalDurationAtom);
    const currentCharIndex = useAtomValue(currentCharIndexAtom);

    return (
        <>
            <div className="mx-auto flex flex-wrap items-center justify-center gap-2">
                <Badge
                    className="w-fit text-xs text-gray-500"
                    variant="outline"
                >
                    WPM: {averageWpm.toFixed(2)}
                </Badge>
                <Badge
                    className="w-fit text-xs text-gray-500"
                    variant="outline"
                >
                    Accuracy: {accuracy.toFixed(2)}%
                </Badge>
                <Badge
                    className="w-fit text-xs text-gray-500"
                    variant="outline"
                >
                    Time: {totalDuration.toFixed(2)} mins
                </Badge>
                <Badge
                    className="w-fit text-xs text-gray-500"
                    variant="outline"
                >
                    Characters: {currentCharIndex} / {typingText.length}
                </Badge>
            </div>
        </>
    );
}
