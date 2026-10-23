// Appends today's (Asia/Calcutta) deliveries to data/log.json. Idempotent per date; also backfills missed days since LOG_START.
const fs = require("fs"); const path = require("path");
const E = require("../engine.js"); Object.assign(global, E);
const R = require("../roster.js");
const file = path.join(__dirname, "..", "data", "log.json");
let log = { generated: "", days: {} };
try { log = JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) {}
const today = process.env.LOG_DATE || R.todayIST();
for (let t = Date.parse(R.LOG_START + "T00:00:00Z"); t <= Date.parse(today + "T00:00:00Z"); t += 864e5) {
  const d = new Date(t).toISOString().slice(0, 10);
  if (!log.days[d] || d === today) log.days[d] = R.deliveriesFor(d);
}
log.generated = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(log));
const n = log.days[today];
console.log(today, "sent", n.filter((x) => x.status === "Sent").length, "suppressed", n.filter((x) => x.status !== "Sent").length);
