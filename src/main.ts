import dotenv from 'dotenv';
import { checkDobijecka } from './adapters/kaktus.js';
import { sendDobijeckaEmbed } from './services/notifier.js';
import fs from 'fs/promises';
import path from 'path';
import { StateFile } from './types.js';
import crypto from "crypto";

dotenv.config();

const STATE_FILE = path.resolve('state.json');
const KAKTUS_URL = process.env.KAKTUS_URL
  ? process.env.KAKTUS_URL
  : 'https://www.mujkaktus.cz/chces-pridat';
const KAKTUS_HREF_TARGET_URL = process.env.KAKTUS_HREF_TARGET_URL
  ? process.env.KAKTUS_HREF_TARGET_URL
  : 'https://www.mujkaktus.cz/dobit-kredit';
const FORCE_TEST = process.env.FORCE_TEST === 'true';
const CHECK_INTERVAL_MINUTES = parseInt(process.env.CHECK_INTERVAL_MINUTES || '10', 10);
const CHECK_INTERVAL_MS = CHECK_INTERVAL_MINUTES * 60 * 1000;

async function loadState(): Promise<StateFile> {
  try {
    const raw = await fs.readFile(STATE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { lastHash: null };
  }
}

async function saveState(state: StateFile): Promise<void> {
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

function hashString(str: string) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

async function runCheck() {
  console.log('🌿 Checking Kaktus page...');
  console.log('🔍 FORCE_TEST =', FORCE_TEST);
  console.log('🔍 KAKTUS_URL =', KAKTUS_URL);
  console.log('🔍 KAKTUS_HREF_TARGET_URL =', KAKTUS_HREF_TARGET_URL);
  console.log(`⏱️ Check interval set to ${CHECK_INTERVAL_MINUTES} minute(s).`);

  const result = await checkDobijecka(FORCE_TEST);
  const state = await loadState();

  const newHash = hashString(result.snippet || "");
  if (result.found && newHash !== state.lastHash) {
    console.log('⚡ Dobíječka detected!');

    const dateMatch = result.snippet?.match(
      /\d{1,2}\.?\s*\d{1,2}\.?\s*\d{4}(?:\s*(?:od|v)?\s*\d{1,2}[:.]\d{2}\s*(?:-|do)?\s*\d{1,2}[:.]\d{2})?/i
    );

    console.log('🧩 Date match result:', dateMatch ? dateMatch[0] : 'None found');
    console.log('📜 Snippet preview:', result.snippet?.slice(0, 200));

    const dateRange = dateMatch ? dateMatch[0].replace(/\s+/g, ' ').trim() : 'Active now';

    await sendDobijeckaEmbed({
      title: '⚡ Dobíječka detected!',
      description: `**${dateRange}**\n\n[Open Kaktus →](${KAKTUS_HREF_TARGET_URL})`,
      url: KAKTUS_HREF_TARGET_URL,
      color: 0x57f287,
    });

    await saveState({ lastHash: newHash });
  } else {
    console.log('🕐 No Dobíječka found yet.');
  }
}

console.log('🪄 Kaktus Watcher is running...\n');

await runCheck();
setInterval(runCheck, CHECK_INTERVAL_MS);
