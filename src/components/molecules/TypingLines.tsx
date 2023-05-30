"use client";

import { useTypeContext } from "@/lib";
import { cn } from "@/utils";
import { ExternalLinkIcon, RotateCw } from "lucide-react";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";

import {
    Badge,
    Button,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    badgeVariants,
} from "../atoms";

interface TypingLinesProps {
    text: string;
    title: string;
    url: string;
}

export function TypingLines({ text, title, url }: TypingLinesProps) {
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

    return (
        <div className="grid max-w-4xl gap-8 ">
            <div className="grid gap-8">
                {startTyping || !isTypingEnd ? (
                    <p className="text-xs text-gray-500">
                        🚀 Type as fast as you can!
                    </p>
                ) : (
                    <div className={cn("text-xs text-gray-500")}>
                        <span>Press</span>
                        <Badge
                            className="mx-1 text-xs text-gray-500"
                            variant="outline"
                        >
                            Enter
                        </Badge>
                        <span>to start typing for</span>
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
                    Words: {currentCharIndex} / {text.length}
                </Badge>
            </div>
            {isTypingEnd() && (
                <div className="mx-auto flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    aria-label="Restart"
                                    size="sm"
                                    className="mx-auto w-fit"
                                    onClick={handleRestart}
                                    variant="ghost"
                                >
                                    <RotateCw className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Restart</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    aria-label="Visit Link"
                                    asChild
                                    size="sm"
                                    className="mx-auto w-fit"
                                    variant="ghost"
                                >
                                    <a
                                        target="_blank"
                                        rel="noopener"
                                        href={url}
                                    >
                                        <ExternalLinkIcon className="rr-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Visit Wikipedia</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}
        </div>
    );
}
