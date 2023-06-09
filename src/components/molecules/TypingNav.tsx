"use client";

import { type GenerateWordsSchema, useGameRestart } from "@/lib";
import { cn } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    mode: GenerateWordsSchema["mode"];
    numberOfWords: string;
    timeCount: GenerateWordsSchema["timeCount"];
}

interface ModeMenu {
    pathname: string;
    mode: GenerateWordsSchema["mode"];
    numberOfWords?: GenerateWordsSchema["numberOfWords"];
    label: string;
}

interface TimeMenu {
    pathname: string;
    mode: GenerateWordsSchema["mode"];
    timeCount?: "10" | "30" | "60" | "120";
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
    {
        pathname: "/",
        mode: "time",
        label: "Time",
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

const timeMenu: TimeMenu[] = [
    {
        pathname: "/",
        mode: "time",
        timeCount: "10",
        label: "10",
    },
    {
        pathname: "/",
        mode: "time",
        timeCount: "30",
        label: "30",
    },
    {
        pathname: "/",
        mode: "time",
        timeCount: "60",
        label: "60",
    },
    {
        pathname: "/",
        mode: "time",
        timeCount: "120",
        label: "120",
    },
];

export function TypingNav({ mode, numberOfWords, timeCount }: TypingNavProps) {
    const { restart } = useGameRestart();
    const router = useRouter();

    const handleLinkClick = () => {
        router.refresh();
        restart();
    };
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
                                };
                            } else {
                                query = {
                                    mode: menu.mode,
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
                                            onClick={handleLinkClick}
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
                                                        },
                                                    }}
                                                    onClick={handleLinkClick}
                                                >
                                                    {menu.label}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    );
                                })}
                            </>
                        )}

                        {mode === "time" && timeCount && (
                            <>
                                <Separator
                                    orientation="vertical"
                                    className="h-6"
                                />
                                {timeMenu.map((menu) => {
                                    return (
                                        <NavigationMenuItem key={menu.label}>
                                            <NavigationMenuLink
                                                asChild
                                                active={
                                                    timeCount === menu.timeCount
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
                                                            timeCount:
                                                                menu.timeCount,
                                                        },
                                                    }}
                                                    onClick={handleLinkClick}
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
                                };
                            } else {
                                query = {
                                    mode: menu.mode,
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
                                    onClick={handleLinkClick}
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
                                                },
                                            }}
                                            onClick={handleLinkClick}
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

                        {mode === "time" && timeCount && (
                            <>
                                <DropdownMenuSeparator />
                                {timeMenu.map((menu) => {
                                    return (
                                        <Link
                                            key={menu.label}
                                            prefetch={false}
                                            href={{
                                                pathname: menu.pathname,
                                                query: {
                                                    mode: menu.mode,
                                                    timeCount: menu.timeCount,
                                                },
                                            }}
                                            onClick={handleLinkClick}
                                        >
                                            <DropdownMenuCheckboxItem
                                                checked={
                                                    timeCount === menu.timeCount
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
