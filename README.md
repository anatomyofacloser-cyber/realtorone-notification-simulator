# RealtorOne Notification Simulator

Static test copy of the RealtorOne notification structure. Open index.html or the GitHub Pages site. No backend; checklist ticks are stored in your browser.

## Daily notification log (`/log/`)
`roster.js` holds 26 test realtors. `engine.js` is the shared delivery engine. `scripts/daily.js` runs the engine for today's date (Asia/Calcutta) and writes `data/log.json`; `.github/workflows/daily-log.yml` runs it every day at 02:00 UTC and commits the result. The page reads `data/log.json` and falls back to computing in the browser.

## Tests, stats, tester pages
- `tests/run.js`: 12 rule checks over `data/log.json` → `data/tests.json`. Runs in the daily job and on every push (`.github/workflows/tests.yml`, also a 60-day forward simulation).
- `/stats/`: KPIs, trends, suppression reasons, coverage, test history.
- `/me/` ("What will I get?"): testers enter their own details; Week test mode (2026-10-23 to 10-29) with daily check-ins, feedback per message, JSON/CSV export.
