"use client";

import { type GenerateWordOptions, useTypeContext } from "@/lib";
import { useQueryString } from "@/lib/hooks/useQueryString";
import { cn } from "@/utils";
import { ExternalLinkIcon, RotateCw } from "lucide-react";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";

import {
    Badge,
    Button,
    ButtonGroup,
    Separator,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    badgeVariants,
    buttonVariants,
} from "../atoms";

interface TypingLinesProps {
    text: string;
    title?: string;
    url?: string;
    mode: GenerateWordOptions["mode"];
    numberOfWords: number;
}

export function TypingLines({
    text,
    title,
    url,
    mode,
    numberOfWords,
}: TypingLinesProps) {
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
        currentCharIndex,
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

    const { redirectWithQs } = useQueryString();

    return (
        <div className=" grid w-full max-w-4xl gap-8 ">
            <div className="grid w-full gap-2">
                <div className="mx-auto">
                    <ButtonGroup>
                        <Button
                            className="text-xs"
                            variant={
                                mode === "wikipedia" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                                redirectWithQs([
                                    { key: "mode", value: "wikipedia" },
                                    {
                                        key: "numberOfWords",
                                        value: "",
                                    },
                                ])
                            }
                        >
                            Wikipedia
                        </Button>
                        <Button
                            className="text-xs"
                            variant={mode === "quotes" ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                                redirectWithQs([
                                    { key: "mode", value: "quotes" },
                                    {
                                        key: "numberOfWords",
                                        value: "",
                                    },
                                ])
                            }
                        >
                            Quote
                        </Button>
                        <Button
                            className="text-xs"
                            variant={mode === "words" ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                                redirectWithQs([
                                    { key: "mode", value: "words" },
                                    {
                                        key: "numberOfWords",
                                        value: numberOfWords.toString(),
                                    },
                                ])
                            }
                        >
                            Words
                        </Button>
                    </ButtonGroup>
                </div>

                {mode === "words" && numberOfWords && (
                    <div className="mx-auto">
                        <ButtonGroup>
                            <Button
                                className="text-xs"
                                variant={
                                    numberOfWords === 10 ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                    redirectWithQs([
                                        { key: "mode", value: "words" },
                                        {
                                            key: "numberOfWords",
                                            value: "10",
                                        },
                                    ])
                                }
                            >
                                10
                            </Button>
                            <Button
                                className="text-xs"
                                variant={
                                    numberOfWords === 30 ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                    redirectWithQs([
                                        { key: "mode", value: "words" },
                                        {
                                            key: "numberOfWords",
                                            value: "30",
                                        },
                                    ])
                                }
                            >
                                30
                            </Button>
                            <Button
                                className="text-xs"
                                variant={
                                    numberOfWords === 50 ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                    redirectWithQs([
                                        { key: "mode", value: "words" },
                                        {
                                            key: "numberOfWords",
                                            value: "50",
                                        },
                                    ])
                                }
                            >
                                50
                            </Button>
                            <Button
                                className="text-xs"
                                variant={
                                    numberOfWords === 100
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                    redirectWithQs([
                                        { key: "mode", value: "words" },
                                        {
                                            key: "numberOfWords",
                                            value: "100",
                                        },
                                    ])
                                }
                            >
                                100
                            </Button>
                        </ButtonGroup>
                    </div>
                )}
            </div>

            <div className="grid  gap-8">
                {startTyping || !isTypingEnd ? (
                    <p className="h-5 text-xs text-gray-500">
                        🚀 Type as fast as you can!
                    </p>
                ) : (
                    <div
                        className={cn(
                            "flex h-5 items-center gap-4 text-xs text-gray-500"
                        )}
                    >
                        <div>
                            <span>Press</span>
                            <Badge
                                className="mx-1 text-xs text-gray-500"
                                variant="outline"
                            >
                                Enter
                            </Badge>
                            <span>to start typing</span>
                        </div>
                        <Separator orientation="vertical" />
                        {mode === "wikipedia" && (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener"
                                className={cn(
                                    badgeVariants({ variant: "outline" }),
                                    "mx-2 text-xs text-gray-500"
                                )}
                            >
                                {title}
                                <ExternalLinkIcon className="ml-2 h-3 w-3" />
                            </a>
                        )}
                        {mode === "quotes" && (
                            <Badge
                                className="mx-1 text-xs text-gray-500"
                                variant="outline"
                            >
                                {title}
                            </Badge>
                        )}
                        {mode === "words" && (
                            <Badge
                                className="mx-1 text-xs text-gray-500"
                                variant="outline"
                            >
                                {numberOfWords} words
                            </Badge>
                        )}
                    </div>
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
            {isTypingEnd() && (
                <div className="mx-auto flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className={cn(
                                        buttonVariants({
                                            size: "sm",
                                            variant: "ghost",
                                        }),
                                        "mx-auto w-fit cursor-pointer"
                                    )}
                                    aria-label="Restart"
                                    onClick={handleRestart}
                                >
                                    <RotateCw className="h-4 w-4" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Restart</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {mode === "wikipedia" && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger
                                    asChild
                                    className={cn(
                                        buttonVariants({
                                            size: "sm",
                                            variant: "ghost",
                                        }),
                                        "mx-auto w-fit"
                                    )}
                                >
                                    <a
                                        target="_blank"
                                        rel="noopener"
                                        href={url}
                                    >
                                        <ExternalLinkIcon className="rr-2 h-4 w-4" />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Visit Wikipedia</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            )}
        </div>
    );
}
