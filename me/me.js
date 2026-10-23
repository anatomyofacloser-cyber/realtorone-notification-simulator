const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const KEY = "r1me-profile";
const T = todayIST();
const addDays = (d, n) => new Date(Date.parse(d + "T00:00:00Z") + n * 864e5).toISOString().slice(0, 10);
const WEEK_START = "2026-10-23";
const DEF = { week: {}, fb: {}, name: "", signup: addDays(T, -6), firstOpen: addDays(T, -6), never: false, pay: "Not paid", trialEnd: addDays(T, 3), feats: {}, callsWeek: 5, callsToday: 0, openedToday: true, usedToday: "none", stage: "Follow-up", habit: "Most days", deal: false, owner: false, push: true, email: true, wa: true, ramadan: false, holiday: false, cap: 4 };
const PAYOPTS = ["Not paid", "Trial (with end date)", "Paid", "Payment failed", "Cancelled", "Expired"];
const enc = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/=+$/, "");
const dec = (s) => { try { return JSON.parse(decodeURIComponent(escape(atob(s)))); } catch (e) { return null; } };
let P = { ...DEF }, SHOWN = false, VIEW = "week";
(() => { const h = location.hash.match(/p=([^&]+)/); const fromHash = h && dec(h[1]); const ls = (() => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } })(); P = { ...DEF, ...(fromHash || ls || {}) }; SHOWN = !!(fromHash || ls); })();

function model(p, today, mods) {
  const D = Math.max(1, dayIdx(p.signup, today));
  const fo = p.never ? Infinity : Math.max(1, dayIdx(p.signup, p.firstOpen));
  const used = FEATS.filter((f) => p.feats[f.key] === "used").map((f) => f.key);
  const opensWeek = { "Every day": 7, "Most days": 5, "Rarely": 1, "Not yet": 0 }[p.habit] || 1;
  const perOpen = p.callsWeek > 0 ? Math.max(1, Math.round(p.callsWeek / Math.max(1, opensWeek))) : 0;
  const stage = p.deal ? "Closure" : p.stage;
  const ck = {};
  for (const [dt, c] of Object.entries(p.week || {})) { const i = dayIdx(p.signup, dt); if (i >= 1) ck[i] = { opened: !!c.opened, used: c.opened && c.used && c.used.length ? c.used[0] : "none", calls: c.opened ? +c.calls || 0 : 0, stage: p.deal ? "Closure" : (c.stage || p.stage), holiday: !!c.holiday }; }
  const beh = (d) => {
    if (mods && mods[d]) return mods[d];
    if (ck[d] && d >= fo) return ck[d];
    if (ck[d] && ck[d].opened && d < fo) return ck[d];
    if (d < fo) return { opened: false, used: "none", calls: 0, stage: "None" };
    if (d === D) { const o = d === fo ? true : !!p.openedToday; return { opened: o, used: o ? p.usedToday : "none", calls: o ? +p.callsToday : 0, stage, holiday: !!p.holiday }; }
    let o = d === fo || { "Every day": true, "Most days": d % 3 !== 0, "Rarely": d % 5 === 0, "Not yet": false }[p.habit];
    if (d > D && p.habit === "Not yet") o = false;
    return { opened: !!o, used: o && used.length ? used[d % used.length] : "none", calls: o ? perOpen : 0, stage };
  };
  const rel = fo === Infinity ? 0 : D - fo;
  let pay = "Not paid (free)", shift = 0;
  if (p.pay === "Trial (with end date)") { pay = "Trial, doesn't pay"; shift = 7 - (dayIdx(p.signup, p.trialEnd) - (fo === Infinity ? D : fo)); }
  else if (p.pay === "Paid") pay = "Paid, renews";
  else if (p.pay === "Payment failed") { pay = "Paid, payment fails"; shift = 10 - rel; }
  else if (p.pay === "Cancelled") { pay = "Paid, then cancels"; shift = 12 - rel; }
  else if (p.pay === "Expired") { pay = "Paid, payment fails"; shift = 16 - rel; }
  const optout = [p.push ? null : "Push", p.email ? null : "Email", p.wa ? null : "WhatsApp"].filter(Boolean);
  const sim = simulate(D + 7, beh, { ramadan: !!p.ramadan, cap: +p.cap || 4, team: !!p.owner, pay, shift, optout });
  return { D, sim, beh, ck };
}
const day = (m, d) => m.sim.msgs.filter((x) => x.day === d);
const sentT = (m, d) => day(m, d).filter((x) => !x.sup).map((x) => `${x.ch}: ${x.title}`);

function form() {
  const f = (k, label, type) => `<label>${label}<input type="${type || "text"}" data-f="${k}" value="${esc(P[k])}"></label>`;
  const s = (k, label, opts) => `<label>${label}<select data-f="${k}">${opts.map((o) => { const v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return `<option value="${esc(v)}"${String(P[k]) === String(v) ? " selected" : ""}>${esc(l)}</option>`; }).join("")}</select></label>`;
  const c = (k, label) => `<label class="tog"><input type="checkbox" data-f="${k}"${P[k] ? " checked" : ""}> ${label}</label>`;
  return `<section class="card"><h2>Your details</h2>
  <fieldset><legend>You</legend><div class="row">${f("name", "Name")}${f("signup", "Signup date", "date")}${f("firstOpen", "First opened the app", "date")}${c("never", "Never opened yet")}</div></fieldset>
  <fieldset><legend>Payment</legend><div class="row">${s("pay", "Payment status", PAYOPTS)}${P.pay.startsWith("Trial") ? f("trialEnd", "Trial end date", "date") : ""}</div></fieldset>
  <fieldset><legend>Features (used / ignored / not seen yet)</legend><div class="feats">${FEATS.map((x) => `<label>${esc(x.name)}<select data-feat="${x.key}">${["unseen", "used", "ignored"].map((v) => `<option value="${v}"${(P.feats[x.key] || "unseen") === v ? " selected" : ""}>${{ unseen: "Not seen", used: "Used", ignored: "Ignored" }[v]}</option>`).join("")}</select></label>`).join("")}</div></fieldset>
  <fieldset><legend>Your week and today</legend><div class="row">${f("callsWeek", "Calls logged this week", "number")}${s("habit", "Morning Coach habit", ["Every day", "Most days", "Rarely", "Not yet"])}${s("stage", "Current lead stage", STAGES)}${c("openedToday", "Opened the app today")}${f("callsToday", "Calls logged today", "number")}${s("usedToday", "Feature used today", [["none", "None"], ...FEATS.map((x) => [x.key, x.name])])}${c("deal", "Deal closed")}${c("owner", "Brokerage owner")}</div></fieldset>
  <fieldset><legend>Channels and timing</legend><div class="row">${c("push", "Push on")}${c("email", "Email on")}${c("wa", "WhatsApp on")}${c("ramadan", "Ramadan timing")}${c("holiday", "Public holiday today")}${s("cap", "Daily cap", ["3", "4", "5"])}</div></fieldset>
  <div class="row"><button class="pri" data-a="go">Show my messages</button><button data-a="share">Copy my link</button><button data-a="clear">Clear my details</button><span id="msg" class="muted"></span></div>
  <p class="muted">Your details stay in this browser (and in the link if you share it). Nothing is sent anywhere.</p></section>`;
}
function preview(m) {
  if (m.ch === "Email") return `<div class="msg"><div class="muted">Email · From: RealtorOne Coach · ${esc(m.time)}</div><b>Subject: ${esc(m.title)}</b><div class="pre">${esc(m.body)}</div></div>`;
  if (m.ch === "WhatsApp") return `<div class="wa"><div class="muted">WhatsApp</div><div class="bubble"><b>${esc(m.title)}</b><div>${esc(m.body)}</div><div class="t">${esc(m.time)}</div></div></div>`;
  return `<div class="msg ${m.ch === "In-app" ? "accent" : ""}"><div class="meta"><span>${m.ch === "Push" ? "Push · RealtorOne" : "In-app"}</span><span>${esc(m.time)}</span></div><b>${esc(m.title)}</b><div>${esc(m.body)}</div></div>`;
}
function results() {
  const base = model(P, T); const D = base.D; const msgs = day(base, D);
  const st = base.sim.state;
  const ifs = [];
  const tb = base.beh(D);
  const variant = (label, mods, at) => { const v = model(P, T, mods); const d = at || D + 1; const a = sentT(base, d), b = sentT(v, d); const plus = b.filter((x) => !a.includes(x)), minus = a.filter((x) => !b.includes(x)); ifs.push({ label, d, plus, minus, b }); };
  if (+tb.calls === 0) variant("If you log 1 call today", { [D]: { ...tb, opened: true, calls: 1 } });
  if (!tb.opened) variant("If you open the app today", { [D]: { ...tb, opened: true } });
  const ign = FEATS.find((f) => P.feats[f.key] !== "used");
  if (ign) variant(`If you try ${ign.name} today`, { [D]: { ...tb, opened: true, used: ign.key } });
  if (tb.opened) variant("If you don't open the app today", { [D]: { ...tb, opened: false, used: "none", calls: 0 } });
  { const mods = {}; for (let k = 1; k <= 3; k++) mods[D + k] = { opened: false, used: "none", calls: 0, stage: tb.stage }; variant("If you go quiet for the next 3 days", mods, D + 4); }
  const chs = ["In-app", "Push", "Email", "WhatsApp"];
  return `<section class="card"><h2>${esc(P.name || "You")}, today ${T} (your day ${D})</h2>
   <div class="stats"><div class="stat"><b>${msgs.filter((m) => !m.sup).length}</b>Messages today</div><div class="stat"><b>${msgs.filter((m) => m.sup).length}</b>Held back</div><div class="stat"><b>${esc(st["Payment status"])}</b>Payment status</div><div class="stat"><b>${esc(st["Call streak"])}</b>Call streak</div></div></section>
   <div class="grid">${chs.map((c) => { const xs = msgs.filter((m) => !m.sup && m.ch === c); return `<div><div class="lbl">${c}</div>${xs.length ? xs.map(preview).join("") : `<div class="msg muted">Nothing on ${c} today.</div>`}</div>`; }).join("")}</div>
   <section class="card"><h2>Why (and what was held back)</h2>${msgs.length ? msgs.map((m) => `<div class="why ${m.sup ? "sup" : ""}"><span class="pill">${m.sup ? "Held back" : esc(m.kind)}</span> <b>${esc(m.time)} · ${m.ch}: ${esc(m.title)}</b><div class="muted">${esc(m.sup ? m.sup + " Planned reason: " + m.why : m.why)}</div></div>`).join("") : `<p class="muted">Nothing scheduled for you today.</p>`}</section>
   <section class="card"><h2>Next 7 days (if you keep your usual habit)</h2><div class="scroll"><table><tr><th>Date</th><th>What you'll get</th></tr>${[1, 2, 3, 4, 5, 6, 7].map((k) => { const xs = day(base, D + k).filter((m) => !m.sup); return `<tr><td>${addDays(T, k)}<br><small>day ${D + k}</small></td><td>${xs.length ? xs.map((m) => `<div><b>${esc(m.time)} · ${m.ch}:</b> ${esc(m.title)}</div>`).join("") : '<span class="muted">Nothing</span>'}</td></tr>`; }).join("")}</table></div></section>
   <section class="card"><h2>What changes if…</h2>${ifs.map((x) => `<div class="diff"><b>${esc(x.label)}</b>, then on ${addDays(T, x.d - D)}:${x.plus.length || x.minus.length ? `<ul>${x.plus.map((s) => `<li class="ok">+ ${esc(s)}</li>`).join("")}${x.minus.map((s) => `<li class="bad">− ${esc(s)}</li>`).join("")}</ul>` : `<div class="muted">No change to that day's messages.</div>`}</div>`).join("")}</section>`;
}
function weekView() {
  const wd = dayIdx(WEEK_START, T);
  const head = wd < 1 ? `The week test starts on ${WEEK_START}.` : wd > 7 ? `The week test (${WEEK_START} to ${addDays(WEEK_START, 6)}) is finished. Export your week below.` : `Week test: day ${wd} of 7 (${T}).`;
  const c = P.week[T] || { opened: P.openedToday, used: [], calls: 0, pay: "", stage: P.stage, holiday: false };
  const ckForm = wd >= 1 && wd <= 7 ? `<section class="card"><h2>Today's check-in (${T})</h2><p class="muted">Tick what you actually did today. Saving updates your details and tomorrow's messages.</p>
   <div class="row"><label class="tog"><input type="checkbox" data-c="opened"${c.opened ? " checked" : ""}> I opened the app today</label><label>Calls logged today<input type="number" min="0" data-c="calls" value="${+c.calls || 0}"></label><label>Lead stage now<select data-c="stage">${STAGES.map((x) => `<option${x === (c.stage || P.stage) ? " selected" : ""}>${x}</option>`).join("")}</select></label><label>Payment change today<select data-c="pay"><option value="">No change</option>${PAYOPTS.map((x) => `<option${x === c.pay ? " selected" : ""}>${x}</option>`).join("")}</select></label><label class="tog"><input type="checkbox" data-c="holiday"${c.holiday ? " checked" : ""}> Holiday today</label></div>
   <div class="feats">${FEATS.map((x) => `<label><input type="checkbox" data-cu="${x.key}"${(c.used || []).includes(x.key) ? " checked" : ""}> ${esc(x.name)}</label>`).join("")}</div>
   <div class="row"><button class="pri" data-a="checkin">Save today's check-in</button><span id="cmsg" class="muted">${P.week[T] ? "Saved for today. You can update it." : ""}</span></div></section>` : "";
  const m = model(P, T);
  const days = []; for (let k = 0; k < 7; k++) { const dt = addDays(WEEK_START, k); if (dt > T) break; days.push(dt); }
  const hist = days.slice().reverse().map((dt) => { const i = dayIdx(P.signup, dt); const xs = i >= 1 ? day(m, i).filter((x) => !x.sup) : []; const ckd = P.week[dt];
    return `<section class="card"><h2>Day ${dayIdx(WEEK_START, dt)} · ${dt}</h2><p class="muted">${ckd ? `Check-in: ${ckd.opened ? "opened the app" : "did not open"}, ${+ckd.calls || 0} calls${ckd.used && ckd.used.length ? ", used " + ckd.used.map((k) => (FEATS.find((f) => f.key === k) || {}).name).join(", ") : ""}${ckd.pay ? ", payment: " + esc(ckd.pay) : ""}.` : "No check-in for this day."}</p>
    ${xs.length ? xs.map((x, j) => { const k = dt + "|" + x.id + "|" + x.ch; const f = P.fb[k] || {}; return `<div class="why"><b>${esc(x.time)} · ${x.ch}: ${esc(x.title)}</b><div>${esc(x.body)}</div><div class="muted">${esc(x.why)}</div>
      <div class="row">Did this make sense? <button data-fb="${esc(k)}" data-v="yes" class="${f.ok === "yes" ? "on" : ""}">Yes</button><button data-fb="${esc(k)}" data-v="no" class="${f.ok === "no" ? "on" : ""}">No</button><input type="text" placeholder="Note (optional)" data-fbn="${esc(k)}" value="${esc(f.note || "")}"></div></div>`; }).join("") : `<p class="muted">No messages that day.</p>`}</section>`; }).join("");
  return `<section class="card"><h2>${esc(head)}</h2><div class="row"><button data-a="exjson">Export my week (JSON)</button><button data-a="excsv">Export my week (CSV)</button><button data-a="share">Copy my link</button></div><p class="muted">Check-ins and feedback are saved in this browser and in your link. Export at the end of the week and send the file to the team.</p></section>${ckForm}<h2 class="h">Messages you received this week</h2>${hist || '<p class="muted">Nothing yet.</p>'}`;
}
function weekRows() {
  const m = model(P, T); const out = [];
  for (let k = 0; k < 7; k++) { const dt = addDays(WEEK_START, k); if (dt > T) break; const i = dayIdx(P.signup, dt); if (i < 1) continue;
    for (const x of day(m, i)) { const f = P.fb[dt + "|" + x.id + "|" + x.ch] || {}; out.push({ tester: P.name, date: dt, week_day: k + 1, channel: x.ch, time: x.time, status: x.sup ? "Held back" : "Sent", id: x.id, title: x.title, body: x.body, reason: x.sup || x.why, made_sense: f.ok || "", note: f.note || "" }); } }
  return out;
}
function dl(name, text, type) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); }
function persist() { localStorage.setItem(KEY, JSON.stringify(P)); history.replaceState(null, "", "#p=" + enc(P)); }
function render() {
  const tabs = `<nav class="views"><a href="#" data-view="week" class="${VIEW === "week" ? "on" : ""}">Week test</a><a href="#" data-view="today" class="${VIEW === "today" ? "on" : ""}">My details & forecast</a></nav>`;
  document.getElementById("app").innerHTML = tabs + (VIEW === "week" ? (SHOWN ? weekView() : `<section class="card"><p>First fill in your details and press "Show my messages".</p></section>` + form()) : form() + (SHOWN ? results() : ""));
}
function readForm() {
  document.querySelectorAll("[data-f]").forEach((el) => { const k = el.dataset.f; P[k] = el.type === "checkbox" ? el.checked : el.type === "number" ? Math.max(0, +el.value || 0) : el.value; });
  document.querySelectorAll("[data-feat]").forEach((el) => { P.feats[el.dataset.feat] = el.value; });
}
document.addEventListener("change", (e) => { if (e.target.dataset.f === "pay") { readForm(); render(); } if (e.target.dataset.fbn) { const k = e.target.dataset.fbn; P.fb[k] = { ...(P.fb[k] || {}), note: e.target.value }; persist(); } });
document.addEventListener("click", (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.view) { e.preventDefault(); VIEW = t.dataset.view; render(); return; }
  if (t.dataset && t.dataset.fb) { const k = t.dataset.fb; P.fb[k] = { ...(P.fb[k] || {}), ok: t.dataset.v }; persist(); render(); return; }
  const a = t.dataset && t.dataset.a; if (!a) return;
  if (a === "checkin") {
    const c = { used: [] }; document.querySelectorAll("[data-c]").forEach((el) => { c[el.dataset.c] = el.type === "checkbox" ? el.checked : el.type === "number" ? Math.max(0, +el.value || 0) : el.value; });
    document.querySelectorAll("[data-cu]").forEach((el) => { if (el.checked) c.used.push(el.dataset.cu); });
    P.week[T] = c; if (c.pay) P.pay = c.pay; if (c.stage) P.stage = c.stage; P.openedToday = c.opened; P.callsToday = c.calls; P.usedToday = c.used[0] || "none"; P.holiday = c.holiday;
    for (const k of c.used) P.feats[k] = "used";
    if (c.opened && P.never) { P.never = false; P.firstOpen = T; }
    persist(); render(); return;
  }
  if (a === "exjson") { dl(`realtorone-week-${(P.name || "tester").replace(/\W+/g, "_")}.json`, JSON.stringify({ exported: new Date().toISOString(), profile: P, messages: weekRows() }, null, 2), "application/json"); return; }
  if (a === "excsv") { const rows = weekRows(); const cols = ["tester", "date", "week_day", "channel", "time", "status", "id", "title", "body", "reason", "made_sense", "note"]; const q = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"'; dl(`realtorone-week-${(P.name || "tester").replace(/\W+/g, "_")}.csv`, [cols.join(","), ...rows.map((r) => cols.map((c) => q(r[c])).join(","))].join("\n"), "text/csv"); return; }
  if (VIEW === "week" && !document.querySelector("[data-f]")) { if (a === "share") { const u = location.href.split("#")[0] + "#p=" + enc(P); (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => {}, () => prompt("Copy your link", u)); } return; }
  readForm();
  if (a === "go") { SHOWN = true; persist(); render(); document.querySelector("section.card:nth-of-type(2)")?.scrollIntoView({ behavior: "smooth" }); }
  if (a === "share") { const u = location.href.split("#")[0] + "#p=" + enc(P); history.replaceState(null, "", u); (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => { document.getElementById("msg").textContent = "Link copied"; }, () => prompt("Copy your link", u)); }
  if (a === "clear") { localStorage.removeItem(KEY); P = { ...DEF, feats: {}, week: {}, fb: {} }; SHOWN = false; history.replaceState(null, "", location.pathname); render(); }
});
render();
