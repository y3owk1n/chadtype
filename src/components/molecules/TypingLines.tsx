"use client";

import { type GenerateWordOptions, useTypeContext } from "@/lib";
import { cn } from "@/utils";
import { ExternalLinkIcon, RotateCw } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";

import {
    Badge,
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    Separator,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    badgeVariants,
    buttonVariants,
    navigationMenuTriggerStyle,
} from "../atoms";

interface TypingLinesProps {
    text: string;
    title?: string;
    url?: string;
    mode: GenerateWordOptions["mode"];
    numberOfWords: number;
}

interface ModeMenu {
    pathname: string;
    mode: GenerateWordOptions["mode"];
    numberOfWords?: GenerateWordOptions["numberOfWords"];
    label: string;
}

const modeMenu: ModeMenu[] = [
    {
        pathname: "/",
        mode: "wikipedia",
        label: "Wikipedia",
    },
    {
        pathname: "/",
        mode: "quotes",
        label: "Quotes",
    },
    {
        pathname: "/",
        mode: "words",
        label: "Words",
        numberOfWords: 30,
    },
];

const wordsMenu: ModeMenu[] = [
    {
        pathname: "/",
        mode: "words",
        numberOfWords: 10,
        label: "10",
    },
    {
        pathname: "/",
        mode: "words",
        numberOfWords: 30,
        label: "30",
    },
    {
        pathname: "/",
        mode: "words",
        numberOfWords: 50,
        label: "50",
    },
    {
        pathname: "/",
        mode: "words",
        numberOfWords: 100,
        label: "100",
    },
];

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
        restart,
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
        <div className=" grid w-full max-w-4xl gap-8 ">
            <div className="mx-auto flex w-fit gap-4 rounded-md border p-2">
                <NavigationMenu>
                    <NavigationMenuList>
                        {modeMenu.map((menu) => {
                            let query;
                            if (menu.numberOfWords) {
                                query = {
                                    mode: menu.mode,
                                    numberOfWords: menu.numberOfWords,
                                    id: crypto.randomUUID(),
                                };
                            } else {
                                query = {
                                    mode: menu.mode,
                                    id: crypto.randomUUID(),
                                };
                            }
                            return (
                                <NavigationMenuItem key={menu.label}>
                                    <NavigationMenuLink
                                        asChild
                                        active={mode === menu.mode}
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "h-auto px-2 py-1 text-xs"
                                        )}
                                    >
                                        <Link
                                            prefetch={false}
                                            href={{
                                                pathname: menu.pathname,
                                                query,
                                            }}
                                            onClick={restart}
                                        >
                                            {menu.label}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            );
                        })}
                    </NavigationMenuList>
                </NavigationMenu>
                {mode === "words" && numberOfWords && (
                    <>
                        <Separator orientation="vertical" />
                        <NavigationMenu>
                            <NavigationMenuList>
                                {wordsMenu.map((menu) => {
                                    return (
                                        <NavigationMenuItem key={menu.label}>
                                            <NavigationMenuLink
                                                asChild
                                                active={
                                                    numberOfWords ===
                                                    menu.numberOfWords
                                                }
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    "h-auto px-2 py-1 text-xs"
                                                )}
                                            >
                                                <Link
                                                    prefetch={false}
                                                    href={{
                                                        pathname: menu.pathname,
                                                        query: {
                                                            mode: menu.mode,
                                                            numberOfWords:
                                                                menu.numberOfWords,
                                                            id: crypto.randomUUID(),
                                                        },
                                                    }}
                                                    onClick={restart}
                                                >
                                                    {menu.label}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    );
                                })}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </>
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
                            isTypingEnd() || !startTyping ? "" : "animate-blink"
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
