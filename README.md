# 🌵 Kaktus Watcher

[![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/runtime-Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Release](https://img.shields.io/badge/release-v0.1.0-blue)](https://github.com/parysoid/kaktus-watcher/releases)
[![Made by parysoid](https://img.shields.io/badge/made_by-parysoid-6e40c9?logo=github)](https://github.com/parysoid)

---

⚡ Monitors [mujkaktus.cz/chces-pridat](https://www.mujkaktus.cz/chces-pridat) for new **Dobíječka** recharge events  
and sends notifications to Discord via webhook.

---

## 🧱 Stack
- **Node.js 23+**
- **TypeScript**
- **Cheerio** for HTML parsing
- **dotenv** for config
- **node-fetch** for webhook calls

---

## ⚙️ Setup

```bash
git clone https://github.com/parysoid/kaktus-watcher.git
cd kaktus-watcher
npm install
```

Create a `.env` file:
```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
FORCE_TEST=false
KAKTUS_URL=https://www.mujkaktus.cz/chces-pridat
KAKTUS_HREF_TARGET_URL=https://www.mujkaktus.cz/dobit-kredit
```

---

## 🚀 Run
Start the watcher:
```bash
npm run dev
```
Runs every 10 minutes and checks for new “Dobíječka” events.

---

## 🧪 Test Mode
If you want to simulate an event without waiting:
```bash
FORCE_TEST=true
```
You’ll immediately get a test embed like this:

> ⚡ **Dobíječka detected!**  
> **15. 10. 2025 15:00 – 17:00**  
> [Open Kaktus →](https://www.mujkaktus.cz/chces-pridat)

---

## 🧩 Architecture
```
src/
├── adapters/      → Web scrapers (Kaktus)
├── services/      → Discord webhook + notifications
├── utils/         → Fetch helpers
├── main.ts        → Entry runner loop
└── types.ts       → Shared type definitions
```

---

## 💡 Environment Variables
| Variable | Description |
|-----------|-------------|
| `DISCORD_WEBHOOK_URL` | Discord webhook endpoint |
| `FORCE_TEST` | Simulated mode (true/false) |
| `KAKTUS_URL` | Target page to scrape |
| `KAKTUS_HREF_TARGET_URL` | “Recharge now” link |

---

## ⚙️ Deploy to Raspberry Pi
```bash
npm run build
npm start
```

Or as systemd service:
```bash
sudo systemctl enable kaktus-watcher
sudo systemctl start kaktus-watcher
```

---

## 🧠 Future Ideas
- Parse “Dnes / Zítra” text automatically  
- Daily summary embed (“No Dobíječka today 🌿”)  
- Historical logging in `/logs`  
- Mini web dashboard  

---

## 📜 License
MIT © 2025 [parysoid](https://github.com/parysoid)

---

🪄 *“Stay charged, stay connected — even the cacti need power sometimes.”*
