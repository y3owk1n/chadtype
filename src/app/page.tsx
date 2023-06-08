import { TypingContainerSkeleton } from "@/components";
import TypingContainerServer from "@/components/molecules/TypingContainerServer";
import { type GenerateWordsSchema } from "@/lib";
import { Suspense } from "react";

interface PageProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export const metadata = {
    alternates: {
        canonical: "/",
    },
};

export default function Page({ searchParams }: PageProps) {
    const paramsMode = (searchParams?.mode ||
        "words") as GenerateWordsSchema["mode"];

    const paramsNumberOfWords = (searchParams?.numberOfWords ||
        "30") as GenerateWordsSchema["numberOfWords"];

    const paramsTimeCount = (searchParams?.timeCount ||
        "30") as GenerateWordsSchema["timeCount"];

    return (
        <div className="grid h-full min-h-[calc(100vh-80px-96px)] place-items-center">
            <div className=" grid w-full max-w-4xl gap-8 ">
                <Suspense
                    key={`${paramsMode}-${paramsNumberOfWords}-${paramsTimeCount}`}
                    fallback={<TypingContainerSkeleton />}
                >
                    <TypingContainerServer
                        paramsNumberOfWords={paramsNumberOfWords}
                        paramsMode={paramsMode}
                        paramsTimeCount={paramsTimeCount}
                    />
                </Suspense>
            </div>
        </div>
    );
}
