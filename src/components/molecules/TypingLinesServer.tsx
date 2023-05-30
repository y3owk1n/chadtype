import { TypingLines } from "@/components";
import { getRandomWikipediaSummary } from "@/lib";

export async function TypingLinesServer() {
    const { sectionText, sectionTitle, sectionUrl } =
        await getRandomWikipediaSummary();

    return (
        <TypingLines
            text={sectionText}
            title={sectionTitle}
            url={sectionUrl}
        />
    );
}
