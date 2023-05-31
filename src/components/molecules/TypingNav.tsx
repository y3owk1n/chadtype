"use client";

import { type useTypeContext, type GenerateWordOptions } from "@/lib";
import { cn } from "@/utils";
import Link from "next/link";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    Separator,
    navigationMenuTriggerStyle,
} from "../atoms";

interface TypingNavProps {
    text: string;
    mode: GenerateWordOptions["mode"];
    numberOfWords: number;
    restart: ReturnType<typeof useTypeContext>["restart"];
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

export function TypingNav({ mode, numberOfWords, restart }: TypingNavProps) {
    return (
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
    );
}
