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
    timeCount: GenerateWordsSchema["timeCount"];
}

export function TypingContainer({
    text,
    title,
    url,
    mode,
    numberOfWords,
    timeCount,
}: TypingContainerProps) {
    const {
        startTypingGame,
        isFocus,
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
        typingText,
        count,
    } = useTypeContext({ text, mode, timeCount });

    return (
        <>
            <TypingNav
                timeCount={timeCount}
                restart={restart}
                mode={mode}
                numberOfWords={numberOfWords}
            />

            <div className="grid gap-4">
                <TypingHeader
                    progress={progress}
                    title={title}
                    url={url}
                    mode={mode}
                    numberOfWords={numberOfWords}
                    count={count}
                    timeCount={timeCount}
                />
                <TypingLines
                    isFocus={isFocus}
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
                text={typingText}
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
