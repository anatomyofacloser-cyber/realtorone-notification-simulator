let LOG = null, SRC = "";
const Q = { view: "today", date: todayIST(), ch: "All", cond: "All", feat: "All", status: "All", user: ROSTER[0].id };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function rowsFor(date) { return (LOG && LOG.days[date]) ? LOG.days[date] : deliveriesFor(date); }
function srcFor(date) { return (LOG && LOG.days[date]) ? "recorded by the daily job" : "computed in your browser (not yet recorded)"; }
function datesUpTo(end) { const out = []; for (let t = Date.parse(LOG_START + "T00:00:00Z"); t <= Date.parse(end + "T00:00:00Z"); t += 864e5) out.push(new Date(t).toISOString().slice(0, 10)); return out; }
function opt(k, v, list) { return `<label>${k}<select data-q="${{Channel:"ch",Condition:"cond",Feature:"feat",Status:"status"}[k]}">${list.map((x) => `<option${x === v ? " selected" : ""}>${esc(x)}</option>`).join("")}</select></label>`; }
function csv(rows) {
  const cols = ["date", "user", "name", "cond", "pay", "day", "ch", "time", "status", "kind", "feature", "id", "title", "body", "why", "sup"];
  const q = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  const blob = new Blob([[cols.join(","), ...rows.map((r) => cols.map((c) => q(r[c])).join(","))].join("\n")], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `realtorone-log-${Q.view === "user" ? Q.user : Q.date}.csv`; a.click();
}
let CUR = [];
function render() {
  const today = todayIST(); if (Q.date > today) Q.date = today; if (Q.date < LOG_START) Q.date = LOG_START;
  let rows = Q.view === "user" ? datesUpTo(today).flatMap((d) => rowsFor(d).filter((r) => r.user === Q.user)).reverse() : rowsFor(Q.date);
  const all = rows;
  const feats = ["All", ...[...new Set(all.map((r) => r.feature))].sort()];
  const conds = ["All", ...[...new Set(ROSTER.map((u) => u.cond))]];
  rows = rows.filter((r) => (Q.ch === "All" || r.ch === Q.ch) && (Q.cond === "All" || r.cond === Q.cond) && (Q.feat === "All" || r.feature === Q.feat) && (Q.status === "All" || r.status === Q.status));
  CUR = rows;
  const sent = rows.filter((r) => r.status === "Sent");
  const byCh = (c) => sent.filter((r) => r.ch === c).length;
  const u = ROSTER.find((x) => x.id === Q.user);
  document.getElementById("app").innerHTML = `
  <nav class="views"><a href="#" data-v="today" class="${Q.view === "today" ? "on" : ""}">Day view</a><a href="#" data-v="user" class="${Q.view === "user" ? "on" : ""}">Per-user history</a><a href="#" data-v="roster" class="${Q.view === "roster" ? "on" : ""}">Roster</a></nav>
  ${Q.view === "roster" ? `<section class="card"><h2>Test realtors (${ROSTER.length})</h2><div class="scroll"><table><tr><th>ID</th><th>Name</th><th>Condition</th><th>Start</th><th>Day today</th><th>Payment path</th><th>Opt-outs</th></tr>${ROSTER.map((x) => `<tr><td><a href="#" data-u="${x.id}">${x.id}</a></td><td>${esc(x.name)}</td><td>${esc(x.cond)}</td><td>${x.start}</td><td>${dayIdx(x.start, today)}</td><td>${esc(x.pay)}</td><td>${(x.optout || []).join(", ") || "None"}</td></tr>`).join("")}</table></div></section>` : `
  <section class="card"><div class="row">
    ${Q.view === "today" ? `<label>Date (Asia/Calcutta)<input type="date" data-q="date" value="${Q.date}" min="${LOG_START}" max="${today}"></label><button data-a="today">Today</button>` : `<label>Realtor<select data-q="user">${ROSTER.map((x) => `<option value="${x.id}"${x.id === Q.user ? " selected" : ""}>${x.id} · ${esc(x.name)}</option>`).join("")}</select></label>`}
    ${opt("Channel", Q.ch, ["All", "In-app", "Push", "Email", "WhatsApp"])}${Q.view === "today" ? opt("Condition", Q.cond, conds) : ""}${opt("Feature", Q.feat, feats)}${opt("Status", Q.status, ["All", "Sent", "Suppressed"])}
    <button class="pri" data-a="csv">Export CSV</button></div>
    <p class="muted">${Q.view === "today" ? `Source: ${srcFor(Q.date)}.` : `${esc(u.cond)} · started ${u.start} · ${esc(u.pay)}${u.optout ? " · opted out of " + u.optout.join(", ") : ""}.`} ${LOG ? "Last recorded run: " + new Date(LOG.generated).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST." : "No recorded log found; everything is computed in your browser."}</p></section>
  <div class="stats"><div class="stat"><b>${sent.length}</b>Sent</div><div class="stat"><b>${rows.length - sent.length}</b>Suppressed</div><div class="stat"><b>${new Set(sent.map((r) => r.user)).size}</b>Realtors reached</div><div class="stat"><b>${byCh("In-app")}</b>In-app</div><div class="stat"><b>${byCh("Push")}</b>Push</div><div class="stat"><b>${byCh("Email")}</b>Email</div><div class="stat"><b>${byCh("WhatsApp")}</b>WhatsApp</div></div>
  <section class="card"><h2>${Q.view === "today" ? (Q.date === today ? "Today, " : "") + Q.date : "History: " + esc(u.name)} (${rows.length} rows)</h2><div class="scroll"><table><tr>${Q.view === "today" ? "<th>Realtor</th>" : "<th>Date</th>"}<th>Channel</th><th>Time</th><th>Status</th><th>Message</th><th>Reason</th></tr>
  ${rows.map((r) => `<tr class="${r.status === "Suppressed" ? "sup" : ""}">${Q.view === "today" ? `<td><a href="#" data-u="${r.user}">${esc(r.name)}</a><br><small>${esc(r.cond)} · day ${r.day} · ${esc(r.pay)}</small></td>` : `<td>${r.date}<br><small>day ${r.day} · ${esc(r.pay)}</small></td>`}<td>${r.ch}</td><td>${esc(r.time)}</td><td>${r.status}</td><td><b>${esc(r.title)}</b><br><small>${esc(r.body)}</small><br><small>${esc(r.feature)} · ${r.id}</small></td><td><small>${esc(r.sup ? r.sup : r.why)}</small></td></tr>`).join("")}
  </table></div></section>`}`;
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-v],[data-a],[data-u]"); if (!t) return; e.preventDefault();
  if (t.dataset.v) Q.view = t.dataset.v;
  if (t.dataset.u) { Q.view = "user"; Q.user = t.dataset.u; Q.feat = "All"; }
  if (t.dataset.a === "today") Q.date = todayIST();
  if (t.dataset.a === "csv") return csv(CUR);
  render();
});
document.addEventListener("change", (e) => { const k = e.target.dataset.q; if (!k) return; Q[k] = e.target.value; render(); });
fetch("../data/log.json", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).catch(() => null).then((j) => { LOG = j; render(); });
