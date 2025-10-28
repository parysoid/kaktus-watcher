import dotenv from 'dotenv';
import { checkDobijecka } from './adapters/kaktus.js';
import { sendDobijeckaEmbed } from './services/notifier.js';
import fs from 'fs/promises';
import path from 'path';
import { StateFile } from './types.js';

dotenv.config();

const STATE_FILE = path.resolve('state.json');
const KAKTUS_URL = process.env.KAKTUS_URL
  ? process.env.KAKTUS_URL
  : 'https://www.mujkaktus.cz/chces-pridat';
const KAKTUS_HREF_TARGET_URL = process.env.KAKTUS_HREF_TARGET_URL
  ? process.env.KAKTUS_HREF_TARGET_URL
  : 'https://www.mujkaktus.cz/dobit-kredit';
const FORCE_TEST = process.env.FORCE_TEST === 'true';

async function loadState(): Promise<StateFile> {
  try {
    const raw = await fs.readFile(STATE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { lastFound: null };
  }
}

async function saveState(state: StateFile): Promise<void> {
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

async function runCheck() {
  console.log('🌿 Checking Kaktus page...');
  console.log('🔍 FORCE_TEST =', FORCE_TEST);
  console.log('🔍 KAKTUS_URL =', KAKTUS_URL);
  console.log('🔍 KAKTUS_HREF_TARGET_URL =', KAKTUS_HREF_TARGET_URL);
  const result = await checkDobijecka(FORCE_TEST);
  const state = await loadState();

  if (result.found && result.snippet !== state.lastFound) {
    console.log('⚡ Dobíječka detected!');

    const dateMatch = result.snippet?.match(
      /\d{1,2}\.\s?\d{1,2}\.\s?\d{4}(?:\s?\d{1,2}:\d{2}\s?-\s?\d{1,2}:\d{2})?/
    );

    const dateRange = dateMatch ? dateMatch[0].replace(/\s+/g, ' ').trim() : 'Active now';

    await sendDobijeckaEmbed({
      title: '⚡ Dobíječka detected!',
      description: `**${dateRange}**\n\n[Open Kaktus →](${KAKTUS_HREF_TARGET_URL})`,
      url: KAKTUS_HREF_TARGET_URL,
      color: 0x57f287,
    });

    await saveState({ lastFound: result.snippet || 'Dobíječka' });
  } else {
    console.log('🕐 No Dobíječka found yet.');
  }
}

console.log('🪄 Kaktus Watcher is running...\n');

await runCheck();
setInterval(runCheck, 10 * 60 * 1000);
