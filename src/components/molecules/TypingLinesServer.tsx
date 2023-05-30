import { TypingLines } from "@/components";
import { type GenerateWordOptions, generateWords } from "@/lib";

interface TypingLinesServerProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export async function TypingLinesServer({
    searchParams,
}: TypingLinesServerProps) {
    const paramsMode = (searchParams?.mode ||
        "wikipedia") as GenerateWordOptions["mode"];

    const paramsNumberOfWords = (searchParams?.numberOfWords || 30) as number;

    const { sectionText, sectionTitle, sectionUrl, mode } = await generateWords(
        {
            mode: paramsMode,
            numberOfWords: paramsNumberOfWords,
        }
    );

    return (
        <TypingLines
            text={sectionText}
            title={sectionTitle}
            url={sectionUrl}
            mode={mode}
            numberOfWords={Number(paramsNumberOfWords)}
        />
    );
}
