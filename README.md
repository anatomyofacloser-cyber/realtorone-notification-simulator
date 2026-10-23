# RealtorOne Notification Simulator

Static test copy of the RealtorOne notification structure. Open index.html or the GitHub Pages site. No backend; checklist ticks are stored in your browser.

## Daily notification log (`/log/`)
`roster.js` holds 26 test realtors. `engine.js` is the shared delivery engine. `scripts/daily.js` runs the engine for today's date (Asia/Calcutta) and writes `data/log.json`; `.github/workflows/daily-log.yml` runs it every day at 02:00 UTC and commits the result. The page reads `data/log.json` and falls back to computing in the browser.
