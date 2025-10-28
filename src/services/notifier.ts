import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!WEBHOOK_URL) {
    console.warn("⚠️  Missing DISCORD_WEBHOOK_URL in .env file!");
}

type EmbedOptions = {
    title: string;
    description: string;
    url: string;
    color?: number;
    footerText?: string;
};

/**
 * Shared Discord webhook sender.
 * Handles all message types (text or embed-based).
 */
async function sendDiscordWebhook(payload: Record<string, any>): Promise<void> {
    if (!WEBHOOK_URL) {
        console.error("❌ No webhook URL configured, skipping message.");
        return;
    }

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}\n${text}`);
        }

        console.log("✅ Discord webhook sent successfully.");
    } catch (error) {
        console.error("❌ Discord webhook error:", error);
    }
}

/**
 * Sends a styled embed for Dobíječka alert.
 */
export async function sendDobijeckaEmbed({
                                             title,
                                             description,
                                             url,
                                             color = 0x57f287,
                                             footerText = `Last check: ${new Date().toLocaleString("cs-CZ")}`,
                                         }: EmbedOptions): Promise<void> {
    const embed = {
        title,
        description,
        url,
        color,
        timestamp: new Date().toISOString(),
        footer: {text: footerText},
    };

    const payload = {
        username: "Kaktus Watcher 🌵",
        avatar_url: "https://www.mujkaktus.cz/favicon.ico",
        embeds: [embed],
    };

    await sendDiscordWebhook(payload);
}

/**
 * (Optional) Sends a simple plain-text message — for logs or errors.
 */
export async function sendPlainMessage(message: string): Promise<void> {
    const payload = {
        username: "Kaktus Watcher 🌵",
        avatar_url: "https://www.mujkaktus.cz/favicon.ico",
        content: message.slice(0, 1900) // Discord limit
    };
    await sendDiscordWebhook(payload);
}
