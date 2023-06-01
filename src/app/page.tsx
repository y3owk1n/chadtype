import { TypingContainerServer, TypingSkeleton } from "@/components";
import { type Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "ChadType",
    description:
        "Welcome to ChadType - a minimalist typing game designed for chads!",
};

interface PageProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Page({ searchParams }: PageProps) {
    return (
        <div className="grid h-[calc(100vh-80px-96px)] place-items-center">
            <Suspense fallback={<TypingSkeleton />}>
                {/* @ts-expect-error Async Server Component */}
                <TypingContainerServer searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
