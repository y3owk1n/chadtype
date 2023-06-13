"use client";

import { progressAtom, type GenerateWordsSchema, useGameRestart } from "@/lib";
import { cn } from "@/utils";
import { useAtomValue } from "jotai";
import { ExternalLinkIcon, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    buttonVariants,
} from "../atoms";

interface TypingFooterProps {
    url?: string;
    mode: GenerateWordsSchema["mode"];
}

export function TypingFooter({ url, mode }: TypingFooterProps) {
    const progress = useAtomValue(progressAtom);
    const { restart } = useGameRestart();
    const router = useRouter();

    if (progress !== "END") return null;

    const handleRestart = () => {
        restart();
        router.refresh();
    };

    return (
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
    );
}
