"use server";

import {
    getRandomEntryfromArray,
    getRandomWordsWithLimit,
    htmlToString,
    removeNonEnglishCharacters,
} from "@/utils";
import { promises as fs } from "fs";
import path from "path";
import { ZodError, z } from "zod";
import { fromZodError } from "zod-validation-error";

interface WikipediaSummary {
    title: string;
    author: string;
    pageid: number;
    content_urls: {
        desktop: WikipediaSummaryContentUrls;
        mobile: WikipediaSummaryContentUrls;
    };
}

type WikipediaSummaryContentUrls = {
    page: string;
    revisions: string;
    edit: string;
    talk: string;
};

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

interface RandomQuote {
    text: string;
    author: string;
}

interface RandomWord {
    text: string;
}

interface GenerateWordData {
    sectionTitle?: string;
    sectionText: string;
    sectionUrl?: string;
    mode: GenerateWordsSchema["mode"];
}

const generateWordsSchema = z.object({
    mode: z.enum(["wikipedia", "quotes", "words"]),
    numberOfWords: z.enum(["10", "30", "50", "100"]),
});

export type GenerateWordsSchema = z.infer<typeof generateWordsSchema>;

export async function generateWords({
    mode,
    numberOfWords,
}: GenerateWordsSchema): Promise<GenerateWordData> {
    try {
        await generateWordsSchema.parseAsync({
            mode,
            numberOfWords,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const validationError = fromZodError(error);
            throw new Error(validationError.message, {
                cause: validationError.cause,
            });
        }
    }

    switch (mode) {
        case "wikipedia":
            return await getRandomWikipediaSummary();
        case "quotes":
            return await getRandomQuotes();
        case "words":
            return await getRandomWords({
                numberOfWords: Number(numberOfWords) || 30,
            });
    }
}

export async function getRandomWords({
    numberOfWords,
}: {
    numberOfWords: number;
}): Promise<GenerateWordData> {
    //Find the absolute path of the json directory
    const jsonDirectory = path.join(process.cwd(), "src", "lib", "data");

    //Read the json data file data.json
    const fileContents = await fs.readFile(
        jsonDirectory + "/words.json",
        "utf8"
    );

    const parsedFileContents = JSON.parse(fileContents) as RandomWord[];

    const randomWords = getRandomWordsWithLimit(
        parsedFileContents,
        numberOfWords
    );

    const formattedRandomWords = randomWords.map((word) => word.text);

    const joinedRandomWords = formattedRandomWords.join(" ");

    return {
        sectionText: joinedRandomWords,
        mode: "words",
    };
}

export async function getRandomQuotes(): Promise<GenerateWordData> {
    const randomQuotesUrl = `https://type.fit/api/quotes`;

    const randomQuotesRes = await fetch(randomQuotesUrl, { cache: "no-store" });

    if (!randomQuotesRes.ok) {
        throw new Error(`Failed to fetch random quotes`);
    }

    const randomQuoteData = (await randomQuotesRes.json()) as RandomQuote[];

    if (!randomQuoteData.length) {
        throw new Error(`No random quote length`);
    }

    const randomQuote = getRandomEntryfromArray(randomQuoteData);

    return {
        sectionTitle: randomQuote?.author as string,
        sectionText: randomQuote?.text as string,
        mode: "quotes",
    };
}

export async function getRandomWikipediaSummary(): Promise<GenerateWordData> {
    const wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/page/random/summary`;
    const wikipediaRes = await fetch(wikipediaUrl, { cache: "no-store" });

    if (!wikipediaRes.ok) {
        throw new Error(`Failed to summary data`);
    }

    const wikipediaData = (await wikipediaRes.json()) as WikipediaSummary;

    const { pageid, content_urls } = wikipediaData;

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

    const wikipediaSectionTitle =
        wikipediaSectionData.query.pages[pageid]?.title;

    if (!wikipediaSectionText || !wikipediaSectionTitle) {
        throw new Error(`Unable to get extracted text or title from section`);
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

    // Remove all non english text
    sectionText = removeNonEnglishCharacters(sectionText);

    // Removing whitespace before and after text
    sectionText = sectionText.trim();

    return {
        sectionUrl: content_urls.desktop.page,
        sectionTitle: wikipediaSectionTitle,
        sectionText,
        mode: "wikipedia",
    };
}
