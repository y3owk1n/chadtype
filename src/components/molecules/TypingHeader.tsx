"use client";

import { type useTypeContext, type GenerateWordOptions } from "@/lib";
import { cn } from "@/utils";
import { ExternalLinkIcon } from "lucide-react";

import { Badge, Separator, badgeVariants } from "../atoms";

interface TypingHeaderProps {
    title?: string;
    url?: string;
    mode: GenerateWordOptions["mode"];
    numberOfWords: number;
    isTypingEnd: ReturnType<typeof useTypeContext>["isTypingEnd"];
    startTyping: ReturnType<typeof useTypeContext>["startTyping"];
}

export function TypingHeader({
    title,
    url,
    mode,
    numberOfWords,
    startTyping,
    isTypingEnd,
}: TypingHeaderProps) {
    return (
        <>
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
                            {title && title.length > 0 ? title : "Unknown"}
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
        </>
    );
}