"use client";

import { buttonVariants } from "@/components";
import { cn } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Blocked() {
    const router = useRouter();

    return (
        <div className="grid h-full min-h-[calc(100vh-80px-96px)] place-items-center">
            <div className="grid max-w-[42rem] gap-8 text-center">
                <div className="grid gap-4">
                    <h1 className="text-4xl font-bold">Blocked</h1>
                    <p className="text-muted-foreground">
                        Only allow 5 requests per 20 seconds. Try again later.
                    </p>
                </div>
                <div className="mx-auto flex gap-4">
                    <Link
                        href="/"
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                            })
                        )}
                        onClick={() => router.refresh()}
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        </div>
    );
}
