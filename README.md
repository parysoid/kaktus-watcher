# 🌵 Kaktus Watcher

A lightweight Node.js + TypeScript scraper that monitors [Kaktus.cz](https://www.mujkaktus.cz/chces-pridat) for **Dobíječka** (bonus recharge) events  
and sends alerts directly to a Discord channel via webhook.

---

## 🚀 Features
- Checks Kaktus recharge page every configurable interval  
- Detects new "Dobíječka" or bonus events  
- Sends styled Discord embed notifications  
- Runs autonomously on Raspberry Pi via systemd  
- Supports test mode and manual checks  

---

## 🧩 Tech Stack
| Area | Technology | Purpose |
|------|-------------|----------|
| Language | TypeScript (Node.js v23) | Full type safety |
| Web Scraping | Cheerio | HTML parsing |
| HTTP | node-fetch | Fetch HTML and send webhook payloads |
| Environment | dotenv | Config via `.env` |
| Deployment | systemd | Auto-run on Raspberry Pi |

---

## ⚙️ Setup

### 1️⃣ Clone and install
```bash
git clone https://github.com/parysoid/kaktus-watcher.git
cd kaktus-watcher
npm install
```

### 2️⃣ Create `.env`
Copy the provided example file and fill in your webhook URL:
```bash
cp .env.example .env
```

### 3️⃣ Run locally
```bash
npm run dev
```

You should see output like:
```
🪄 Kaktus Watcher is running...
🌿 Checking Kaktus page...
✅ Discord embed sent.
```

---

## 🔧 Environment Variables

| Variable | Description | Example | Default |
|-----------|-------------|----------|----------|
| `DISCORD_WEBHOOK_URL` | Discord webhook URL to send alerts to | `https://discord.com/api/webhooks/...` | — |
| `FORCE_TEST` | If `true`, simulate a fake "Dobíječka" event | `false` | `false` |
| `KAKTUS_URL` | URL of the page to scrape | `https://www.mujkaktus.cz/chces-pridat` | same |
| `KAKTUS_HREF_TARGET_URL` | Target URL to include in embed links | `https://www.mujkaktus.cz/dobit-kredit` | same |
| `CHECK_INTERVAL_MINUTES` | Interval in minutes between checks | `10` | `10` |

---

### 🧾 Example `.env`
```env
# Discord Webhook URL (required)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxxxxxxxxxxxxxx

# Enable force test mode (true/false)
FORCE_TEST=false

# Target URLs for Kaktus page and recharge form
KAKTUS_URL=https://www.mujkaktus.cz/chces-pridat
KAKTUS_HREF_TARGET_URL=https://www.mujkaktus.cz/dobit-kredit

# Scrape interval in minutes
CHECK_INTERVAL_MINUTES=10
```

---

## 💻 Raspberry Pi Deployment

The watcher can run automatically on boot using `systemd`.

### Create a service:
```bash
sudo nano /etc/systemd/system/kaktus-watcher.service
```

Paste this:
```ini
[Unit]
Description=Kaktus Watcher 🌵 - Dobíječka alert bot
After=network.target

[Service]
ExecStart=/usr/bin/npm run dev
WorkingDirectory=/home/pi/kaktus-watcher
Restart=always
User=pi
Environment=NODE_ENV=production
StandardOutput=append:/home/pi/kaktus-watcher/log.txt
StandardError=append:/home/pi/kaktus-watcher/error.txt

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable kaktus-watcher
sudo systemctl start kaktus-watcher
```

Check status:
```bash
sudo systemctl status kaktus-watcher
```

---

## 🧠 Notes
- Default interval: every 10 minutes  
- Safe to lower to 5 minutes, but avoid <1 minute to prevent rate-limits  
- Tested on Raspberry Pi OS (Bullseye / Bookworm)  
- Handles reboot automatically via systemd  

---

## 📦 License
MIT © [parysoid](https://github.com/parysoid)

---

🪄 _“Kaktus never sleeps — now neither does your watcher.”_
