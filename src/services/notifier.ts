import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!WEBHOOK_URL) {
    console.warn("⚠️  Missing DISCORD_WEBHOOK_URL in .env file!");
}

/**
 * Sends an embed alert to Discord webhook.
 */
export async function sendDobijeckaEmbed({
                                             title,
                                             description,
                                             url,
                                             color = 0x57f287 // default: green
                                         }: {
    title: string;
    description: string;
    url: string;
    color?: number;
}): Promise<void> {
    if (!WEBHOOK_URL) return;

    const payload = {
        username: "Kaktus Watcher 🌵",
        avatar_url: "https://www.mujkaktus.cz/favicon.ico",
        embeds: [
            {
                title,
                description,
                url,
                color,
                footer: {
                    text: `Last check: ${new Date().toLocaleString("cs-CZ")}`
                }
            }
        ]
    };

    try {
        const res = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const text = await res.text();

        if (!res.ok) {
            console.error(`❌ Discord webhook failed: ${res.status} ${res.statusText}`);
            console.error(`Response: ${text}`);
        } else {
            console.log("✅ Discord embed sent.");
        }
    } catch (err) {
        console.error("❌ Error sending Discord embed:", err);
    }
}
