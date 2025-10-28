import fetch from "node-fetch";

/**
 * Fetches a webpage and returns its raw HTML as string.
 */
export async function fetchPage(url: string): Promise<string> {
    const response = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (KaktusWatcher/1.0; +https://github.com/parysoid/kaktus-watcher)"
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    return await response.text();
}
