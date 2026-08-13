# NarrowsFiler — quick start for Claude

Orientation for a future session. Written 2026-08-13.

## What this app is
A **static, no-build web tool** (plain HTML/CSS/JS) hosted on **GitHub Pages**
at `https://realeasyalgo.github.io/NarrowsFiler/`. A trader drops in a text file
of `BYBIT:*` perpetual symbols (exported from a Bybit-based scanner) and gets
back a TradingView watchlist where each symbol is **re-routed to the user's
preferred exchange** that actually lists it, grouped under `###EXCHANGE`
dividers.

## Core mechanic (read these two files first)
- `js/transform_EA_narrows.js` — the heart. For each input symbol it walks the
  user's **exchange priority order** and assigns the symbol to the first
  exchange whose `AssetsPerExchange.json` list contains it. Output is nested
  **exchange (priority order) → trend section (input order)**, so a file with
  `###ABOVE / ###IN BETWEEN / ###BELOW` headers yields dividers like
  `###BINGX ABOVE`. Section-less input → plain `###EXCHANGE` dividers.
- `js/handleDropZone.js` — `validateBybitFile()`. Tolerates `###` divider lines
  and trims each line (whitespace-safe). Rejects non-`BYBIT:` symbol lines.
- Supporting: `js/main.js` (`handleFile`, `loadAssetsPerExchange`, `collectArgs`),
  `js/handleFields.js` (exchange tiles, cookies), `js/utils.js` (constants).

## Data files
- `AssetsPerExchange.json` — the catalog: `{ EXCHANGE: ["SYM1USDT.P", ...] }`.
  **Auto-regenerated daily** (see below). Do not hand-edit.
- `Exchanges.json` — the ordered exchange list shown as draggable tiles, and the
  exchange codes used in output. **This is where prefix renames get fixed.**
- `AssetsPerExchange.py` — regenerates the catalog from the TradingView scanner
  (`scanner.tradingview.com/crypto/scan`, empty payload = full universe).

## The self-sustaining catalog automation
`.github/workflows/refresh-catalog.yml` (daily 06:17 UTC + manual dispatch):
1. Checks out **using `KEEPALIVE_PAT`** (a fine-grained PAT secret) so pushes
   count as real activity and reset GitHub's **60-day scheduled-workflow
   auto-disable timer** (GITHUB_TOKEN pushes do NOT count).
2. Runs `AssetsPerExchange.py`, commits the catalog **only if it changed**.
3. If the branch has been idle 50+ days, makes an empty keepalive commit.
4. Reads the PAT's real expiry from the `github-authentication-token-expiration`
   header and Telegram-nags for the 14 days before it expires (self-updating —
   no hardcoded date).
5. `failure()` → Telegram alert.

Secrets in the repo: `KEEPALIVE_PAT`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
Manual kick / PAT push test: `gh workflow run refresh-catalog.yml -f force_keepalive=true`.
PAT rotation runbook: `HOW_TO_REFRESH_THE_TOKEN__KEEPALIVE_PAT.txt` (expires 2027-08-14).

## Local dev
`./launcher.sh` → `npx servor . index.html 3000 --reload --browse`.
Dev server is **servor** (zero runtime deps). browser-sync was removed — it
dragged in the whole vulnerable transitive tree. Keep `npm audit` at 0.

## Known gotchas
- **TradingView exchange-prefix drift.** e.g. `GATEIO` → `GATE` (Aug 2026). A
  refresh that shows an exchange with **0 assets** = the prefix was renamed;
  fix it in `Exchanges.json` (and users must clear their saved-exchanges cookie,
  since `handleFields.js` prefers the cookie over `Exchanges.json`).
- **Symbols "unavailable" in TradingView** usually = stale catalog claiming an
  exchange carries a since-delisted symbol. The daily refresh prevents this.
- **BYBIT is the natural catch-all** because every input symbol originates from a
  Bybit account, so BYBIT (last in priority) always lists it.
- **Caching:** GitHub Pages serves assets with `max-age=600` + content ETag, and
  there is **no service worker**, so the page cannot go permanently stale —
  returning users revalidate within ~10 min. Don't add a service worker without
  a cache-versioning plan.

## Conventions
- Solo project; commits go straight to `main` with conventional-commit messages.
- The user does NOT use GitHub Issues (told me directly).
- User is `martinhbramwell` / repo owner `RealEasyAlgo`.

## See also
Persistent memory index: `~/.claude/projects/-home-hasan-projects-Trading-NarrowsFiler/memory/MEMORY.md`
(notably `catalog-refresh-automation.md`).
