# 🌵 Kaktus Watcher

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

## 📜 License
MIT © 2025 [parysoid](https://github.com/parysoid)

---

🪄 *“Stay charged, stay connected — even the cacti need power sometimes.”*
