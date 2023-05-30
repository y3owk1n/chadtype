import { TypingLinesServer } from "@/components";
import { type Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Home",
    description: "Welcome to Next.js",
};

export default function Page() {
    return (
        <div className="grid h-screen place-items-center">
            <Suspense fallback={<p>Loading...</p>}>
                {/* @ts-expect-error Async Server Component */}
                <TypingLinesServer />
            </Suspense>
        </div>
    );
}
