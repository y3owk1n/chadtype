import { TypingLines } from "@/components";
import { getRandomWikipediaSummary } from "@/lib";

export async function TypingLinesServer() {
    const text = await getRandomWikipediaSummary();

    return <TypingLines text={text} />;
}
