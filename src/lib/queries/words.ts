import { htmlToString, removeNonEnglishCharacters } from "@/utils";

interface WikipediaSummary {
    title: string;
    author: string;
    pageid: number;
}

interface WikipediaSection {
    batchcomplete: string;
    warnings: {
        exracts: {
            [key: string]: string;
        };
    };
    query: {
        pages: {
            [key: string]: {
                pageid: number;
                ns: number;
                title: string;
                extract: string;
            };
        };
    };
}

export async function getRandomWikipediaSummary() {
    const wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/page/random/summary`;
    const wikipediaRes = await fetch(wikipediaUrl, { cache: "no-store" });

    if (!wikipediaRes.ok) {
        throw new Error(`Failed to summary data`);
    }

    const { pageid } = (await wikipediaRes.json()) as WikipediaSummary;

    if (!pageid) {
        throw new Error(`No pageid found`);
    }

    const sectionURL = `https://en.wikipedia.org/w/api.php?action=query&format=json&pageids=${pageid}&prop=extracts&exintro=true&origin=*`;

    const wikipediaSectionRes = await fetch(sectionURL);

    if (!wikipediaSectionRes.ok) {
        throw new Error(`Failed to get section data`);
    }

    const wikipediaSectionData =
        (await wikipediaSectionRes.json()) as WikipediaSection;

    const wikipediaSectionText =
        wikipediaSectionData.query.pages[pageid]?.extract;

    if (!wikipediaSectionText) {
        throw new Error(`Unable to get extracted text from section`);
    }

    let sectionText = wikipediaSectionText;

    // Converting to one paragraph
    sectionText = sectionText.replace(/<\/p><p>+/g, " ");

    // Convert HTML to text
    sectionText = htmlToString(sectionText);

    // Remove reference links
    sectionText = sectionText.replace(/\[\d+\]/gi, "");

    // Remove invisible characters
    sectionText = sectionText.replace(/[\u200B-\u200D\uFEFF]/g, "");

    // Convert all whitespace to space
    sectionText = sectionText.replace(/\s+/g, " ");

    console.log({ sectionText });

    // Remove all non english text
    sectionText = removeNonEnglishCharacters(sectionText);

    // Removing whitespace before and after text
    sectionText = sectionText.trim();

    return sectionText;
}
