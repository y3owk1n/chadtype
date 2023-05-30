import { TypingLines } from "@/components";
import { type GenerateWordOptions, generateWords } from "@/lib";

interface TypingLinesServerProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export async function TypingLinesServer({
    searchParams,
}: TypingLinesServerProps) {
    const paramsMode = (searchParams?.mode ??
        "wikipedia") as GenerateWordOptions["mode"];

    const { sectionText, sectionTitle, sectionUrl, mode } = await generateWords(
        {
            mode: paramsMode,
        }
    );

    return (
        <TypingLines
            text={sectionText}
            title={sectionTitle}
            url={sectionUrl}
            mode={mode}
        />
    );
}
