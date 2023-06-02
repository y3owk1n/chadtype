"use client";

import { type GenerateWordsSchema, useTypeContext } from "@/lib";

import { TypingFooter } from "./TypingFooter";
import { TypingHeader } from "./TypingHeader";
import { TypingLines } from "./TypingLines";
import { TypingNav } from "./TypingNav";
import { TypingStatistics } from "./TypingStatistics";

interface TypingContainerProps {
    text: string;
    title?: string;
    url?: string;
    mode: GenerateWordsSchema["mode"];
    numberOfWords: string;
}

export function TypingContainer({
    text,
    title,
    url,
    mode,
    numberOfWords,
}: TypingContainerProps) {
    const {
        startTypingGame,
        inputRef,
        progress,
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
    } = useTypeContext({ text, mode });

    return (
        <>
            <TypingNav
                restart={restart}
                mode={mode}
                text={text}
                numberOfWords={numberOfWords}
            />

            <div className="grid gap-4">
                <TypingHeader
                    progress={progress}
                    title={title}
                    url={url}
                    mode={mode}
                    numberOfWords={numberOfWords}
                />
                <TypingLines
                    startTypingGame={startTypingGame}
                    inputRef={inputRef}
                    wordsBeforeCurrentCharacter={wordsBeforeCurrentCharacter}
                    currentCharacter={currentCharacter}
                    wordsAfterCurrentCharacter={wordsAfterCurrentCharacter}
                    progress={progress}
                    errorIndexBeforeCurrentCharacter={
                        errorIndexBeforeCurrentCharacter
                    }
                />
            </div>
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
                progress={progress}
            />
        </>
    );
}
