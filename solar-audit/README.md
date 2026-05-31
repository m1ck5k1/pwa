# Solar Audit PWA

**Sovereign Node — Weston Class 3 Facility**
Home Solar System Audit · Progressive Web App

A 12-section solar energy system audit tool. Works fully offline.
Installs to home screen. Prints to US Letter. Auto-saves all data locally.

---

## Folder Location

```
~/dev/pwa/solar-audit/
```

Part of the `m1ck5k1/pwa` repository — see repo strategy below.

---

## Files

```
solar-audit/
├── index.html      Main audit document + PWA chrome
├── sw.js           Service worker (offline caching, background sync)
├── manifest.json   Web app manifest (name, icon, display mode)
├── icon.svg        App icon — solar + battery symbol
└── README.md       This file
```

---

## Local Development

Requires a local HTTP server — service workers are blocked on
`file://` protocol. Use any of the following:

```bash
# Option 1 — npx serve (no install required)
cd ~/dev/pwa
npx serve .
# Opens at http://localhost:3000
# App at http://localhost:3000/solar-audit/

# Option 2 — Python
cd ~/dev/pwa
python3 -m http.server 3000
# App at http://localhost:3000/solar-audit/

# Option 3 — VS Code Live Server
# Right-click index.html → Open with Live Server
```

Open in **Chrome** for development. Use DevTools → Application →
Service Workers to inspect registration, cache, and offline simulation.

---

## GitHub Pages Deployment

### One-time setup

```bash
# 1. Create the repo (if not already done)
cd ~/dev
git init pwa
cd pwa
git remote add origin git@github.com:m1ck5k1/pwa.git

# 2. Add a root index.html (optional — lists all PWAs)
echo "<h1>m1ck5k1 PWA Projects</h1>" > index.html

# 3. Copy solar-audit into repo
cp -r ~/dev/pwa/solar-audit ./solar-audit

# 4. Commit and push
git add .
git commit -m "feat: add solar-audit PWA"
git push -u origin main

# 5. Enable GitHub Pages
# GitHub → repo Settings → Pages → Source: main branch / root
```

Live at: `https://m1ck5k1.github.io/pwa/solar-audit/`

### Subsequent deployments

```bash
cd ~/dev/pwa
cp -r ~/dev/pwa/solar-audit ./solar-audit   # sync changes
git add solar-audit/
git commit -m "chore: update solar-audit"
git push
```

GitHub Pages rebuilds automatically. Changes live in ~30 seconds.

---

## Installing on iPhone (iOS)

Service workers and PWA install work correctly on iOS **Safari only**.
iOS Chrome works as a website but cannot install to home screen.

**Steps:**
1. Open `https://m1ck5k1.github.io/pwa/solar-audit/` in **Safari**
2. Tap the **Share** button (box with arrow)
3. Scroll down → tap **"Add to Home Screen"**
4. Name it "Solar Audit" → tap **Add**

The app launches in standalone mode (no browser chrome).
Auto-save keeps all data between sessions.

> A hint banner appears automatically on first Safari visit —
> it disappears after 7 seconds and is shown only once.

---

## Installing on Android / Desktop Chrome

The **Install** button appears automatically in the navy PWA bar
when the browser is ready. Tap it to install.

---

## Offline Behaviour

Once installed or visited once, the app works fully offline:

- All form data auto-saves to localStorage every 600ms
- Service worker caches all static assets on first load
- Offline indicator (red dot + banner) shows when network drops
- All 12 sections remain fully functional offline
- Data persists across sessions and app restarts

---

## Printing

Tap **Print** in the PWA bar, or use Cmd+P / Ctrl+P.

All PWA chrome is hidden automatically via `@media print`.
Prints clean to US Letter at 0.75in margins.
One accent colour only (navy `#1a1a6e`) — ink-economical.

---

## Data Management

All form data is stored in `localStorage` under the key
`solar-audit-v1`. To clear all data: tap **Clear** in the PWA bar.

**There is no cloud sync in this version.**
Data lives on the device only. For multi-device sync, a future
version will POST to the Weston Class 3 node API.

---

## Repo Strategy — Multiple PWAs

This repo is designed to host multiple PWAs as subdirectories.
Each is fully isolated — separate service worker, separate cache,
separate manifest. They do not interfere with each other.

```
m1ck5k1/pwa (GitHub repo)
    ↓
m1ck5k1.github.io/pwa/

├── solar-audit/        ← this app
├── hhrf-monitor/       ← HHRF sensor dashboard (planned)
├── fni-tool/           ← Field Network Interrogator UI (planned)
├── node-health/        ← Sovereign Node health dashboard (planned)
└── index.html          ← PWA directory listing
```

**Why this works:**
Service workers scope to the directory they are registered from.
`solar-audit/sw.js` controls only pages under `solar-audit/`.
`hhrf-monitor/sw.js` controls only pages under `hhrf-monitor/`.
Zero interference. One repo. One Pages setup.

**Key rule for each new PWA:**
Use relative paths in `sw.js` (`./index.html` not `/index.html`)
and relative `start_url`/`scope` in `manifest.json` (`./` not `/`).
This solar-audit is the reference implementation — copy the pattern.

---

## Sovereign Node Classification

```
Class:   1 — Field Node (Web)
Layer:   2 — Compute (client-side)
Pattern: Island First — operates without WAN
Sync:    localStorage → future: POST to Class 3 node API
Parent:  Weston Class 3 Facility Node
```

---

## Roadmap

- [ ] IndexedDB replace localStorage (larger data, better performance)
- [ ] Export to PDF (client-side, no server)
- [ ] Multi-device sync via Weston Class 3 node API
- [ ] Audit history (multiple saved audits, date-stamped)
- [ ] Pre-populate fields from Tesla API (when API available)
- [ ] HHRF audit variant (same architecture, different sections)

---

## Co-authorship

Built by Michael Brewer + Claude Butler
Part of the Sovereign Node project — `m1ck5k1/sovereign-node`
MIT licence
