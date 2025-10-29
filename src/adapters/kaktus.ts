import * as cheerio from 'cheerio';
import { fetchPage } from '../utils/fetchPage.js';

const KAKTUS_URL =
    process.env.KAKTUS_URL || 'https://www.mujkaktus.cz/chces-pridat';

/**
 * Scrapes Kaktus page and extracts Dobíječka date & time from the known element.
 * If `forceTest` is true, returns a simulated Dobíječka event for testing.
 */
export async function checkDobijecka(
    forceTest = false
): Promise<{ found: boolean; snippet?: string }> {
    if (forceTest) {
        console.log('🧪 Force test mode enabled — simulating Dobíječka.');
        return {
            found: true,
            snippet: '15. 10. 2025 15:00 - 17:00',
        };
    }

    const html = await fetchPage(KAKTUS_URL);
    const $ = cheerio.load(html);

    const dateElement = $('div.richTextStyles h4').first();
    const dateText = dateElement.text().trim();

    if (dateText && /\d{1,2}\.\s?\d{1,2}\.\s?\d{4}/.test(dateText)) {
        console.log('📅 Found Dobíječka date in richTextStyles:', dateText);
        return { found: true, snippet: dateText };
    }

    console.log('❌ No Dobíječka <h4> element found.');
    return { found: false };
}
