import * as cheerio from 'cheerio';
import {fetchPage} from '../utils/fetchPage.js';

const KAKTUS_URL =
    process.env.KAKTUS_URL || 'https://www.mujkaktus.cz/chces-pridat';

const KEYWORDS = ['dobíječka', 'dobíjej', 'dvojnásobek', 'bonus', 'extra kredit'];

/**
 * Scrapes Kaktus page and searches for Dobíječka mentions.
 * If `forceTest` is true, returns a simulated Dobíječka event for testing.
 */
export async function checkDobijecka(forceTest = false): Promise<{ found: boolean; snippet?: string }> {
    if (forceTest) {
        console.log('🧪 Force test mode enabled — simulating Dobíječka.');
        return {
            found: true,
            snippet: 'Dobíječka 15. 10. 2025 15:00 - 17:00 – test mode simulation.',
        };
    }

    const html = await fetchPage(KAKTUS_URL);
    const $ = cheerio.load(html);

    $('script, style, iframe, noscript').remove();

    const text = $('body').text().replace(/\s+/g, ' ').trim().toLowerCase();

    const lines = text.split(/[.!?]/);
    const match = lines.find((line) =>
        KEYWORDS.some((keyword) => line.includes(keyword))
    );

    if (match) {
        const snippet = match
            .replace(/\s+/g, ' ')
            .replace(/(\d{1,2})\.\s{2,}(\d{4})/g, '$1. 10. $2') // keep month fix
            .trim()
            .slice(0, 300);

        return {found: true, snippet};
    }

    return {found: false};
}
