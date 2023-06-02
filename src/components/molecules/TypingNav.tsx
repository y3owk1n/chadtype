"use client";

import { type useTypeContext, type GenerateWordsSchema } from "@/lib";
import { cn } from "@/utils";
import Link from "next/link";

import {
    Button,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    ScrollArea,
    Separator,
    navigationMenuTriggerStyle,
} from "../atoms";

interface TypingNavProps {
    text: string;
    mode: GenerateWordsSchema["mode"];
    numberOfWords: string;
    restart: ReturnType<typeof useTypeContext>["restart"];
}

interface ModeMenu {
    pathname: string;
    mode: GenerateWordsSchema["mode"];
    numberOfWords?: GenerateWordsSchema["numberOfWords"];
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
        numberOfWords: "30",
    },
];

const wordsMenu: ModeMenu[] = [
    {
        pathname: "/",
        mode: "words",
        numberOfWords: "10",
        label: "10",
    },
    {
        pathname: "/",
        mode: "words",
        numberOfWords: "30",
        label: "30",
    },
    {
        pathname: "/",
        mode: "words",
        numberOfWords: "50",
        label: "50",
    },
    {
        pathname: "/",
        mode: "words",
        numberOfWords: "100",
        label: "100",
    },
];

export function TypingNav({ mode, numberOfWords, restart }: TypingNavProps) {
    return (
        <>
            <ScrollArea className="mx-auto hidden h-full w-fit gap-4 rounded-md border p-2 md:flex">
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

                        {mode === "words" && numberOfWords && (
                            <>
                                <Separator
                                    orientation="vertical"
                                    className="h-6"
                                />
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
                            </>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
            </ScrollArea>
            <div className="mx-auto md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="sm"
                            variant="outline"
                        >
                            Settings
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
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
                                <Link
                                    key={menu.label}
                                    prefetch={false}
                                    href={{
                                        pathname: menu.pathname,
                                        query,
                                    }}
                                    onClick={restart}
                                >
                                    <DropdownMenuCheckboxItem
                                        checked={mode === menu.mode}
                                    >
                                        {menu.label}
                                    </DropdownMenuCheckboxItem>
                                </Link>
                            );
                        })}

                        {mode === "words" && numberOfWords && (
                            <>
                                <DropdownMenuSeparator />
                                {wordsMenu.map((menu) => {
                                    return (
                                        <Link
                                            key={menu.label}
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
                                            <DropdownMenuCheckboxItem
                                                checked={
                                                    numberOfWords ===
                                                    menu.numberOfWords
                                                }
                                            >
                                                {menu.label}
                                            </DropdownMenuCheckboxItem>
                                        </Link>
                                    );
                                })}
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}
