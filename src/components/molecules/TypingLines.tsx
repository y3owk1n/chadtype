"use client";

import { useKeyPress } from "@/lib";
import { generateWords } from "@/utils";
import { useCallback, useState } from "react";

import { Button } from "../atoms";

const count = 50;

export function TypingLines() {
    const [words, setWords] = useState(generateWords({ count }));
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentWord, setCurrentWord] = useState(0);

    const [totalDuration, setTotalDuration] = useState(0);

    const [actualTypedChar, setActualTypedChar] = useState(0);

    const [accuracy, setAuccuracy] = useState(0);
    const [wpm, setWpm] = useState(0);

    const currentTime = useCallback(() => {
        return new Date().getTime();
    }, []);

    const calculateAccuracy = useCallback(() => {
        return ((currentCharIndex + 1) / actualTypedChar) * 100;
    }, [actualTypedChar, currentCharIndex]);

    const isTypingEnd = useCallback(() => {
        return currentCharIndex === words.length;
    }, [currentCharIndex, words.length]);

    useKeyPress((key) => {
        if (isTypingEnd()) return;

        if (!startTime) setStartTime(currentTime());

        const currentChar = words[currentCharIndex];

        setActualTypedChar((prev) => prev + 1);

        if (startTime && key === currentChar) {
            if (key === " ") {
                setCurrentWord((prev) => prev + 1);
            }

            setCurrentCharIndex((prev) => prev + 1);

            const durationInMinutes = (currentTime() - startTime) / 60000.0;

            const wpm = (currentWord + 1) / durationInMinutes;

            setWpm(wpm);
            setAuccuracy(calculateAccuracy());
            setTotalDuration(durationInMinutes);
        }
    });

    const handleRestart = () => {
        setActualTypedChar(0);
        setAuccuracy(0);
        setCurrentCharIndex(0);
        setCurrentWord(0);
        setStartTime(null);
        setWpm(0);
        setWords(generateWords({ count }));
        setTotalDuration(0);
    };

    return (
        <div>
            <div className="grid gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                <p className="">
                    <span>{words.substring(0, currentCharIndex || 0)}</span>
                    <span className="font-bold text-blue-500 underline underline-offset-2">
                        {words[currentCharIndex || 0]}
                    </span>
                    <span>{words.substring(currentCharIndex + 1)}</span>
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
