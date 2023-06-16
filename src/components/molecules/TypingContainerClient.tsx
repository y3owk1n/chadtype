"use client";

import { type GenerateWordsSchema, typingTextAtom, progressAtom } from "@/lib";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import { TypingChart } from "./TypingChart";
import { TypingFooter } from "./TypingFooter";
import { TypingHeader } from "./TypingHeader";
import { TypingLines } from "./TypingLines";
import { TypingNav } from "./TypingNav";
import { TypingStatistics } from "./TypingStatistics";

interface TypingContainerClientProps {
    text: string;
    title?: string;
    url?: string;
    mode: GenerateWordsSchema["mode"];
    numberOfWords: string;
    timeCount: GenerateWordsSchema["timeCount"];
}

export function TypingContainerClient({
    text,
    title,
    url,
    mode,
    numberOfWords,
    timeCount,
}: TypingContainerClientProps) {
    const setTypingText = useSetAtom(typingTextAtom);
    const progress = useAtomValue(progressAtom);

    useEffect(() => {
        setTypingText(text);
    }, [setTypingText, text]);
    return (
        <>
            <TypingNav
                timeCount={timeCount}
                mode={mode}
                numberOfWords={numberOfWords}
            />

            <div className="grid gap-4">
                {progress === "END" ? (
                    <TypingChart />
                ) : (
                    <>
                        <TypingHeader
                            title={title}
                            url={url}
                            mode={mode}
                            numberOfWords={numberOfWords}
                            timeCount={timeCount}
                        />
                        <TypingLines
                            mode={mode}
                            timeCount={timeCount}
                        />
                    </>
                )}
            </div>
            <TypingStatistics />
            <TypingFooter
                mode={mode}
                url={url}
            />
        </>
    );
}
