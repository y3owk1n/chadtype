import { type GenerateWordsSchema, generateWords } from "@/lib";

import { TypingContainer } from "./TypingContainerClient";

interface TypingContainerServerProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export async function TypingContainerServer({
    searchParams,
}: TypingContainerServerProps) {
    const paramsMode = (searchParams?.mode ||
        "wikipedia") as GenerateWordsSchema["mode"];

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
        <div className=" grid w-full max-w-4xl gap-8 ">
            <TypingContainer
                mode={mode}
                text={sectionText}
                title={sectionTitle}
                url={sectionUrl}
                numberOfWords={paramsNumberOfWords}
            />
        </div>
    );
}
