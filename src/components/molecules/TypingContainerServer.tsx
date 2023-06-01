import { type GenerateWordOptions, generateWords } from "@/lib";

import { TypingContainer } from "./TypingContainerClient";

interface TypingContainerServerProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export async function TypingContainerServer({
    searchParams,
}: TypingContainerServerProps) {
    const paramsMode = (searchParams?.mode ||
        "wikipedia") as GenerateWordOptions["mode"];

    const paramsNumberOfWords = searchParams?.numberOfWords || 30;

    const { sectionText, sectionTitle, sectionUrl, mode } = await generateWords(
        {
            mode: paramsMode,
            numberOfWords: Number(paramsNumberOfWords),
        }
    );

    return (
        <div className=" grid w-full max-w-4xl gap-8 ">
            <TypingContainer
                mode={mode}
                text={sectionText}
                title={sectionTitle}
                url={sectionUrl}
                numberOfWords={Number(paramsNumberOfWords)}
            />
        </div>
    );
}
