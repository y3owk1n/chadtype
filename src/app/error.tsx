"use client";

import { Button, buttonVariants } from "@/components";
import { cn } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    const router = useRouter();

    return (
        <div className="grid h-full min-h-[calc(100vh-80px-96px)] place-items-center">
            <div className="grid max-w-[42rem] gap-8 text-center">
                <div className="grid gap-4">
                    <h1 className="text-4xl font-bold">
                        Ooppssss... an error occured.
                    </h1>
                    <p className="text-muted-foreground">{error.message}</p>
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
                        Back To Home
                    </Link>
                    <Button onClick={reset}>Try Again</Button>
                </div>
            </div>
        </div>
    );
}
