import { TypingContainerClient } from "@/components";
import { type GenerateWordsSchema, generateWords } from "@/lib";

interface TypingContainerServerProps {
    paramsMode: GenerateWordsSchema["mode"];
    paramsNumberOfWords: GenerateWordsSchema["numberOfWords"];
    paramsTimeCount: GenerateWordsSchema["timeCount"];
}

export default async function TypingContainerServer({
    paramsMode,
    paramsTimeCount,
    paramsNumberOfWords,
}: TypingContainerServerProps) {
    const { sectionText, sectionTitle, sectionUrl, mode } = await generateWords(
        {
            mode: paramsMode,
            numberOfWords: paramsNumberOfWords,
            timeCount: paramsTimeCount,
        }
    );

    return (
        <TypingContainerClient
            mode={mode}
            text={sectionText}
            title={sectionTitle}
            url={sectionUrl}
            numberOfWords={paramsNumberOfWords}
            timeCount={paramsTimeCount}
        />
    );
}
