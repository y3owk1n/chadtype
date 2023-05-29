import { TypingLines } from "@/components";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
    description: "Welcome to Next.js",
};

export default function Page() {
    return (
        <div className="grid h-screen place-items-center">
            <TypingLines />
        </div>
    );
}
