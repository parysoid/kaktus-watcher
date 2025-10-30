import * as cheerio from 'cheerio';
import { fetchPage } from '../utils/fetchPage.js';

const KAKTUS_URL =
    process.env.KAKTUS_URL || 'https://www.mujkaktus.cz/chces-pridat';

/**
 * Scrapes Kaktus.cz for the Dobíječka date from known element.
 * - Normal mode: only upcoming events are considered valid.
 * - FORCE_TEST=true: allows matching even past events (for testing).
 */
export async function checkDobijecka(
    forceTest = false
): Promise<{ found: boolean; snippet?: string }> {
    const html = await fetchPage(KAKTUS_URL);
    const $ = cheerio.load(html);

    const dateElement = $('div.richTextStyles h4').first();
    const dateText = dateElement.text().trim();

    if (!dateText) {
        console.log('❌ No <h4> element with date found.');
        return { found: false };
    }

    const dateMatch = dateText.match(/\d{1,2}\.\s?\d{1,2}\.\s?\d{4}/);
    if (!dateMatch) {
        console.log('❌ No valid date found in text:', dateText);
        return { found: false };
    }

    const [day, month, year] = dateMatch[0]
        .replace(/\s/g, '')
        .split('.')
        .filter(Boolean)
        .map(Number);

    const eventDate = new Date(year, month - 1, day);
    const now = new Date();

    if (!forceTest && eventDate.getTime() < now.getTime() - 1000 * 60 * 60 * 24) {
        console.log('⏳ Found past Dobíječka date, ignoring:', dateMatch[0]);
        return { found: false };
    }

    console.log(
        forceTest
            ? `🧪 FORCE_TEST active — accepting date ${dateText} (past or future).`
            : `📅 Found upcoming Dobíječka date: ${dateText}`
    );

    return { found: true, snippet: dateText };
}
