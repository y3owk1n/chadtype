"use client";

import { type GenerateWordsSchema, progressAtom, countAtom } from "@/lib";
import { cn } from "@/utils";
import { useAtomValue } from "jotai";
import { ExternalLinkIcon } from "lucide-react";

import { Badge, Separator, badgeVariants } from "../atoms";

interface TypingHeaderProps {
    title?: string;
    url?: string;
    mode: GenerateWordsSchema["mode"];
    numberOfWords: string;
    timeCount: GenerateWordsSchema["timeCount"];
}

export function TypingHeader({
    title,
    url,
    mode,
    numberOfWords,
    timeCount,
}: TypingHeaderProps) {
    const progress = useAtomValue(progressAtom);
    const count = useAtomValue(countAtom);

    return (
        <div className="grid gap-4">
            {progress === "STARTED" && (
                <div
                    className={cn(
                        "flex flex-col gap-4 text-xs text-gray-500 md:flex-row md:items-center"
                    )}
                >
                    <p className="h-5 text-xs text-gray-500">
                        🚀 Type as fast as you can!
                    </p>

                    {mode === "time" && (
                        <Badge
                            className="w-fit text-xs text-gray-500 md:mx-1"
                            variant="outline"
                        >
                            {count} seconds
                        </Badge>
                    )}
                </div>
            )}

            {(progress === "PENDING" || progress === "END") && (
                <div
                    className={cn(
                        "flex flex-col gap-4 text-xs text-gray-500 md:flex-row md:items-center"
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
                        <span>or click any words to start typing</span>
                    </div>
                    <Separator
                        orientation="vertical"
                        className="hidden md:block"
                    />
                    {mode === "wikipedia" && (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener"
                            className={cn(
                                badgeVariants({ variant: "outline" }),
                                "w-fit text-xs text-gray-500 md:mx-2"
                            )}
                        >
                            Content: {title}
                            <ExternalLinkIcon className="ml-2 h-3 w-3" />
                        </a>
                    )}
                    {mode === "quotes" && (
                        <Badge
                            className="w-fit text-xs text-gray-500 md:mx-1"
                            variant="outline"
                        >
                            Content:{" "}
                            {title && title.length > 0 ? title : "Unknown"}
                        </Badge>
                    )}
                    {mode === "words" && (
                        <Badge
                            className="w-fit text-xs text-gray-500 md:mx-1"
                            variant="outline"
                        >
                            {numberOfWords} words
                        </Badge>
                    )}
                    {mode === "time" && (
                        <Badge
                            className="w-fit text-xs text-gray-500 md:mx-1"
                            variant="outline"
                        >
                            {timeCount} seconds
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
