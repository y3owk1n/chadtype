import { TypingContainer } from "@/components";
import { type GenerateWordsSchema, generateWords } from "@/lib";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "ChadType",
    description:
        "Welcome to ChadType - a minimalist typing game designed for chads!",
};

interface PageProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: PageProps) {
    const paramsMode = (searchParams?.mode ||
        "words") as GenerateWordsSchema["mode"];

    const paramsNumberOfWords =
        typeof searchParams?.numberOfWords === "string"
            ? searchParams?.numberOfWords
            : "30";

    const { sectionText, sectionTitle, sectionUrl, mode } = await generateWords(
        {
            mode: paramsMode,
            numberOfWords:
                paramsNumberOfWords as GenerateWordsSchema["numberOfWords"],
        }
    );

    return (
        <div className="grid h-full min-h-[calc(100vh-80px-96px)] place-items-center">
            <div className=" grid w-full max-w-4xl gap-8 ">
                <TypingContainer
                    mode={mode}
                    text={sectionText}
                    title={sectionTitle}
                    url={sectionUrl}
                    numberOfWords={paramsNumberOfWords}
                />
            </div>
        </div>
    );
}
