// Automated rule checks over data/log.json. Writes data/tests.json. Exit 1 if any rule fails today.
const fs = require("fs"); const path = require("path");
const E = require("../engine.js"); Object.assign(global, E);
const R = require("../roster.js");
const root = path.join(__dirname, "..");
const log = JSON.parse(fs.readFileSync(path.join(root, "data/log.json"), "utf8"));
const ACT = { "MC-01": "today-plan", "MC-02": "today-plan", "OLC-03": "today-plan", "MC-03": "call-log", "HAB-03": "call-log", "ACC-03": "welcome", "WB-02": "welcome", "SLP-03": "re-entry", "SLP-07": "re-entry", "SLP-14": "re-entry", "SLP-30": "re-entry", "PAY-08": "re-entry" };
const isMoney = (id) => /^(PAY|IMP)/.test(id) || id === "WB-01";
const actOf = (r) => ACT[r.id] || (isMoney(r.id) ? "money" : r.id);
const live = (r) => r.kind === "Milestone" && r.ch === "In-app";
const BANNED = /\b(beliefs?|identity|mindset|subconscious)\b/i;
const PAIDLIKE = /^(Paid|Renewed|Cancelled)/;
const REPEAT_N = 7, NO_REPEAT_KINDS = ["Feature nudge", "Offer", "Value", "Re-entry", "Referral"];
const EMOJI = /\p{Extended_Pictographic}/gu;
function lint(r) {
  const t = r.title || "", b = (r.body || "").replace(/\n\nYour coach, RealtorOne$|\n\nRealtorOne$/, ""), errs = [];
  const all = t + " " + b;
  if ((all.match(EMOJI) || []).length > 1) errs.push("more than 1 emoji");
  if ((all.match(/!/g) || []).length > 1) errs.push("exclamation spam");
  if (BANNED.test(all)) errs.push("banned word");
  const arrows = (b.match(/→/g) || []).length;
  if (r.ch === "Push") { if (t.length > 40) errs.push(`push title ${t.length}>40`); if (b.length > 90) errs.push(`push body ${b.length}>90`); if (arrows) errs.push("push has CTA arrow"); }
  if (r.ch === "In-app") { const w = t.trim().split(/\s+/).length; if (w > 8) errs.push(`in-app headline ${w} words`); if (arrows !== 1) errs.push("in-app needs exactly 1 CTA"); else { const [line, cta] = b.split("→"); if (line.trim().length > 90) errs.push("in-app line >90"); if (cta.trim().split(/\s+/).length > 3) errs.push("in-app CTA >3 words"); } }
  if (r.ch === "Email") { if (t.length > 45) errs.push(`subject ${t.length}>45`); if (arrows !== 1) errs.push("email needs exactly 1 CTA"); if ((b.match(/^• /gm) || []).length > 3) errs.push("more than 3 bullets"); if (b.length > 600) errs.push("email body too long"); }
  if (r.ch === "WhatsApp") { if (!/^".+"$/.test(t.trim())) errs.push("WhatsApp title must be the objection in quotes"); if (b.length > 160) errs.push(`WhatsApp reply ${b.length}>160`); if (b.split("\n").length > 2) errs.push("WhatsApp reply >2 lines"); }
  return errs;
}
const toMin = (t) => { const m = /^(\d{1,2}):(\d{2}) (AM|PM)/.exec(t); if (!m) return null; let h = +m[1] % 12; if (m[3] === "PM") h += 12; return h * 60 + +m[2]; };
const users = Object.fromEntries(R.ROSTER.map((u) => [u.id, u]));
const firstOpen = {}, activeBefore = {};
for (const u of R.ROSTER) { let a = 0; activeBefore[u.id] = {}; for (let d = 1; d <= 400; d++) { activeBefore[u.id][d] = a; const b = E.PERSONAS[u.persona](d); if (b.opened) { if (!firstOpen[u.id]) firstOpen[u.id] = d; a++; } } }
const dates = Object.keys(log.days).sort();
const out = { generated: new Date().toISOString(), rules: [], days: {} };
const RULES = [
  ["dup-activity", "One message per activity per realtor per day"],
  ["one-job-channel", "One job per channel per day (in-app milestone exception)"],
  ["daily-cap", "Daily cap respected (in-app milestone exception)"],
  ["opt-out", "Nothing sent on an opted-out channel"],
  ["no-early-welcome", "No welcome before first open"],
  ["offer-eligibility", "No offers to paid users or before 3 active days (today counts)"],
  ["value-ratio", "At least 4 value messages per offer (cumulative)"],
  ["no-repeat", `Same message not repeated to a realtor within ${REPEAT_N} days`],
  ["banned-words", "No banned words in customer-facing copy"],
  ["quiet-hours", "Scheduled sends between 8 AM and 9 PM"],
  ["money-per-day", "Max 1 payment message per day"],
  ["has-reason", "Every row has a reason"],
  ["copy-lint", "Copy: length limits, max 1 emoji, max 1 '!', single CTA, WhatsApp objection format"],
];
out.rules = RULES.map(([id, name]) => ({ id, name }));
const lastSeen = {}; const cum = {};
// seed history from before the log started, so cumulative rules see each realtor's full past
for (const u of R.ROSTER) {
  const pre = R.dayIdx(u.start, R.LOG_START) - 1; if (pre < 1) continue;
  const sim = E.simulate(pre, E.PERSONAS[u.persona], { ramadan: !!u.ramadan, cap: u.cap || 4, team: !!u.team, pay: u.pay, optout: u.optout || [] });
  const c = (cum[u.id] = { v: 0, o: 0 });
  for (const m of sim.msgs.filter((x) => !x.sup)) {
    if (m.kind === "Value") c.v++; if (m.kind === "Offer") c.o++;
    if (NO_REPEAT_KINDS.includes(m.kind)) lastSeen[u.id + "|" + m.title] = Date.parse(R.LOG_START) - (pre - m.day + 1) * 864e5;
  }
}
for (const date of dates) {
  const rows = log.days[date]; const sent = rows.filter((r) => r.status === "Sent");
  const fail = Object.fromEntries(RULES.map(([id]) => [id, []]));
  const by = {}; for (const r of sent) (by[r.user] = by[r.user] || []).push(r);
  for (const [uid, rs] of Object.entries(by)) {
    const u = users[uid]; const cap = u.ramadan ? 3 : (u.cap || 4);
    const acts = {}, chs = {}; let n = 0, money = 0;
    for (const r of rs) {
      const a = actOf(r); if (acts[a]) fail["dup-activity"].push(r); acts[a] = 1;
      if (!live(r)) { if (chs[r.ch]) fail["one-job-channel"].push(r); chs[r.ch] = 1; n++; }
      if ((u.optout || []).includes(r.ch)) fail["opt-out"].push(r);
      if ((r.id === "ACC-03") && r.day !== firstOpen[uid]) fail["no-early-welcome"].push(r);
      if (r.id === "ACC-03" || r.id === "WB-02") { if (!firstOpen[uid] || r.day < firstOpen[uid]) fail["no-early-welcome"].push(r); }
      if (r.kind === "Offer" && (PAIDLIKE.test(r.pay) || activeBefore[uid][r.day] + (E.PERSONAS[u.persona](r.day).opened ? 1 : 0) < 3)) fail["offer-eligibility"].push(r);
      if (isMoney(r.id)) money++;
      if (BANNED.test(r.title + " " + r.body)) fail["banned-words"].push(r);
      const m = toMin(r.time); if (m !== null && (m < 480 || m >= 1260)) fail["quiet-hours"].push(r);
      if (!r.why || !r.why.trim()) fail["has-reason"].push(r);
    }
    if (n > cap) fail["daily-cap"].push(...rs.filter((r) => !live(r)).slice(cap));
    if (money > 1) fail["money-per-day"].push(...rs.filter((r) => isMoney(r.id)));
  }
  // cumulative checks need history: walk each realtor's sent rows across days
  for (const r of sent) {
    const c = (cum[r.user] = cum[r.user] || { v: 0, o: 0 });
    if (r.kind === "Value") c.v++;
    if (r.kind === "Offer") { c.o++; if (c.v < 4 * c.o) fail["value-ratio"].push({ ...r, note: `value ${c.v} / offers ${c.o}` }); }
    if (NO_REPEAT_KINDS.includes(r.kind)) {
      const k = r.user + "|" + r.title; const t = Date.parse(date);
      if (lastSeen[k] !== undefined && (t - lastSeen[k]) / 864e5 < REPEAT_N) fail["no-repeat"].push(r);
      lastSeen[k] = t;
    }
  }
  for (const r of rows) { if (!r.why || !r.why.trim()) fail["has-reason"].push(r); const le = lint(r); if (le.length) fail["copy-lint"].push({ ...r, note: le.join("; ") }); }
  const res = RULES.map(([id]) => ({ id, pass: fail[id].length === 0, failures: fail[id].length, rows: fail[id].slice(0, 20).map((r) => ({ user: r.user, name: r.name, day: r.day, ch: r.ch, time: r.time, id: r.id, title: r.title, note: r.note || "" })) }));
  out.days[date] = { rows: rows.length, sent: sent.length, passed: res.filter((x) => x.pass).length, total: res.length, results: res };
}
fs.writeFileSync(path.join(root, "data/tests.json"), JSON.stringify(out));
let bad = 0;
for (const d of dates) { const x = out.days[d]; const f = x.results.filter((r) => !r.pass); if (f.length) { bad++; console.log(d, "FAIL", f.map((r) => `${r.id}(${r.failures})`).join(", ")); } }
const last = out.days[dates[dates.length - 1]];
console.log(`Days checked: ${dates.length}. Latest ${dates[dates.length - 1]}: ${last.passed}/${last.total} rules passed.`);
process.exit(bad ? 1 : 0);
