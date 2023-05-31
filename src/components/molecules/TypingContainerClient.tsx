"use client";

import { type GenerateWordOptions, useTypeContext } from "@/lib";

import { TypingFooter } from "./TypingFooter";
import { TypingHeader } from "./TypingHeader";
import { TypingLines } from "./TypingLines";
import { TypingNav } from "./TypingNav";
import { TypingStatistics } from "./TypingStatistics";

interface TypingContainerProps {
    text: string;
    title?: string;
    url?: string;
    mode: GenerateWordOptions["mode"];
    numberOfWords: number;
}

export function TypingContainer({
    text,
    title,
    url,
    mode,
    numberOfWords,
}: TypingContainerProps) {
    const {
        isTypingEnd,
        startTyping,
        restart,
        handleRestart,
        wordsBeforeCurrentCharacter,
        currentCharacter,
        wordsAfterCurrentCharacter,
        errorIndexBeforeCurrentCharacter,
        wpm,
        accuracy,
        totalDuration,
        currentCharIndex,
    } = useTypeContext({ text });

    return (
        <>
            <TypingNav
                restart={restart}
                mode={mode}
                text={text}
                numberOfWords={numberOfWords}
            />

            <div className="grid gap-8">
                <TypingHeader
                    isTypingEnd={isTypingEnd}
                    startTyping={startTyping}
                    title={title}
                    url={url}
                    mode={mode}
                    numberOfWords={numberOfWords}
                />
                <TypingLines
                    wordsBeforeCurrentCharacter={wordsBeforeCurrentCharacter}
                    currentCharacter={currentCharacter}
                    wordsAfterCurrentCharacter={wordsAfterCurrentCharacter}
                    isTypingEnd={isTypingEnd}
                    startTyping={startTyping}
                    errorIndexBeforeCurrentCharacter={
                        errorIndexBeforeCurrentCharacter
                    }
                />
                <TypingStatistics
                    text={text}
                    wpm={wpm}
                    accuracy={accuracy}
                    totalDuration={totalDuration}
                    currentCharIndex={currentCharIndex}
                />
                <TypingFooter
                    mode={mode}
                    handleRestart={handleRestart}
                    isTypingEnd={isTypingEnd}
                />
            </div>
        </>
    );
}
