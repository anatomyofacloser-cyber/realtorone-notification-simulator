const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
let LOG, TESTS, RANGE = "all", DRILL = "";
const count = (rows, f) => { const m = {}; for (const r of rows) { const k = f(r); m[k] = (m[k] || 0) + 1; } return Object.entries(m).sort((a, b) => b[1] - a[1]); };
function hbars(entries, cls) {
  const max = Math.max(1, ...entries.map((e) => e[1])); const h = 22 * entries.length + 4;
  return `<svg viewBox="0 0 600 ${h}" width="100%" role="img">${entries.map(([k, v], i) => `<text x="0" y="${i * 22 + 15}">${esc(k).slice(0, 34)}</text><rect class="${cls || "bar"}" x="230" y="${i * 22 + 4}" width="${(330 * v) / max}" height="14" rx="3"></rect><text x="${236 + (330 * v) / max}" y="${i * 22 + 15}">${v}</text>`).join("")}</svg>`;
}
function trend(dates, series) {
  const W = 600, H = 180, P = 30; const max = Math.max(1, ...series.flatMap((s) => s.vals));
  const x = (i) => P + (dates.length < 2 ? 0 : (i * (W - 2 * P)) / (dates.length - 1)); const y = (v) => H - 20 - (v * (H - 40)) / max;
  const ticks = dates.length <= 6 ? dates.map((d, i) => i) : [0, 1, 2, 3, 4, 5].map((k) => Math.round((k * (dates.length - 1)) / 5));
  return `<svg viewBox="0 0 ${W} ${H}" width="100%">${[0, 0.5, 1].map((f) => `<text x="0" y="${y(max * f) + 4}">${Math.round(max * f)}</text>`).join("")}
  ${series.map((s) => dates.length === 1 ? `<circle cx="${x(0)}" cy="${y(s.vals[0])}" r="4" class="${s.cls}"></circle>` : `<polyline fill="none" stroke-width="2" stroke="${s.cls === "bar" ? "var(--ac)" : "#d9a400"}" points="${s.vals.map((v, i) => x(i) + "," + y(v)).join(" ")}"></polyline>`).join("")}
  ${ticks.map((i) => `<text x="${x(i) - 18}" y="${H - 4}">${dates[i].slice(5)}</text>`).join("")}</svg><div class="muted">${series.map((s) => `<span class="${s.cls === "bar" ? "" : ""}">■ ${s.name}</span>`).join(" &nbsp; ")}</div>`;
}
function render() {
  const all = Object.keys(LOG.days).sort(); const dates = RANGE === "7" ? all.slice(-7) : all;
  const rows = dates.flatMap((d) => LOG.days[d]); const sent = rows.filter((r) => r.status === "Sent"), sup = rows.filter((r) => r.status !== "Sent");
  const last = all[all.length - 1]; const today = LOG.days[last]; const tSent = today.filter((r) => r.status === "Sent");
  const promoted = new Set(sent.filter((r) => r.id === "PROMO").map((r) => r.feature));
  const never = FEATS.map((f) => f.name).filter((n) => !promoted.has(n));
  const tdates = Object.keys(TESTS ? TESTS.days : {}).sort();
  const td = TESTS && TESTS.days[last];
  const perUser = ROSTER.map((u) => [u.id + " " + u.name, sent.filter((r) => r.user === u.id).length]).sort((a, b) => b[1] - a[1]);
  const supReason = count(sup, (r) => (r.sup.match(/^Suppressed \(([^)]+)\)/) || [, r.sup.split(":")[0]])[1]);
  const fails = [];
  if (TESTS) for (const d of tdates) for (const r of TESTS.days[d].results) if (!r.pass) fails.push([d, r]);
  document.getElementById("app").innerHTML = `
  <section class="card"><div class="row"><label>Range<select id="range"><option value="all"${RANGE === "all" ? " selected" : ""}>All recorded days (${all.length})</option><option value="7"${RANGE === "7" ? " selected" : ""}>Last 7 days</option></select></label></div>
  <p class="muted">Latest recorded day: ${last}. Log generated ${new Date(LOG.generated).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST. Test realtors only; nothing is sent to real people.</p></section>
  <h2 class="h">Today (${last})</h2>
  <div class="stats"><div class="stat"><b>${tSent.length}</b>Sent</div><div class="stat"><b>${today.length - tSent.length}</b>Suppressed</div><div class="stat"><b>${new Set(tSent.map((r) => r.user)).size} / ${ROSTER.length}</b>Realtors reached</div>${["In-app", "Push", "Email", "WhatsApp"].map((c) => `<div class="stat"><b>${tSent.filter((r) => r.ch === c).length}</b>${c}</div>`).join("")}<div class="stat"><b class="${td && td.passed === td.total ? "ok" : "bad"}">${td ? td.passed + "/" + td.total : "n/a"}</b>Rules passed</div></div>
  <h2 class="h">Selected range (${dates.length} days)</h2>
  <div class="stats"><div class="stat"><b>${sent.length}</b>Sent</div><div class="stat"><b>${sup.length}</b>Suppressed</div><div class="stat"><b>${rows.length ? Math.round((100 * sup.length) / rows.length) : 0}%</b>Suppression rate</div><div class="stat"><b>${(sent.length / Math.max(1, dates.length * ROSTER.length)).toFixed(2)}</b>Sent per realtor per day</div></div>
  <section class="card"><h2>Daily trend</h2>${trend(dates, [{ name: "Sent", cls: "bar", vals: dates.map((d) => LOG.days[d].filter((r) => r.status === "Sent").length) }, { name: "Suppressed", cls: "bar2", vals: dates.map((d) => LOG.days[d].filter((r) => r.status !== "Sent").length) }])}</section>
  <div class="grid">
    <section class="card"><h2>By channel (sent)</h2>${hbars(count(sent, (r) => r.ch))}</section>
    <section class="card"><h2>Suppression reasons</h2>${hbars(supReason, "bar2")}</section>
    <section class="card"><h2>By lifecycle stage (sent)</h2>${hbars(count(sent, (r) => r.kind))}</section>
    <section class="card"><h2>By payment state (sent)</h2>${hbars(count(sent, (r) => r.pay))}</section>
    <section class="card"><h2>By feature (sent)</h2>${hbars(count(sent, (r) => r.feature))}</section>
    <section class="card"><h2>By condition (sent)</h2>${hbars(count(sent, (r) => r.cond))}</section>
  </div>
  <section class="card"><h2>Feature promotion coverage</h2><p>${FEATS.length - never.length} of ${FEATS.length} features were promoted at least once in this range.</p>${never.length ? `<p class="muted">Never promoted: ${never.map(esc).join(", ")}.</p>` : ""}</section>
  <section class="card"><h2>Messages per realtor (sent)</h2>${hbars(perUser)}</section>
  <section class="card"><h2>Automated rule tests</h2>${TESTS ? `
    <p>${tdates.length} day(s) checked. Pass rate: ${Math.round((100 * tdates.reduce((a, d) => a + TESTS.days[d].passed, 0)) / Math.max(1, tdates.reduce((a, d) => a + TESTS.days[d].total, 0)))}% of rule checks. Last run ${new Date(TESTS.generated).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST.</p>
    <div class="scroll"><table><tr><th>Date</th><th>Rows</th><th>Passed</th>${TESTS.rules.map((r) => `<th title="${esc(r.name)}">${esc(r.id)}</th>`).join("")}</tr>${tdates.slice().reverse().map((d) => { const x = TESTS.days[d]; return `<tr><td>${d}</td><td>${x.rows}</td><td>${x.passed}/${x.total}</td>${x.results.map((r) => `<td class="${r.pass ? "ok" : "bad"}">${r.pass ? "✓" : `<a href="#" data-drill="${d}|${r.id}">✗ ${r.failures}</a>`}</td>`).join("")}</tr>`; }).join("")}</table></div>
    <ul class="muted">${TESTS.rules.map((r) => `<li>${esc(r.id)}: ${esc(r.name)}</li>`).join("")}</ul>
    ${fails.length ? `<h2>Failure drill-down</h2>${fails.filter(([d, r]) => !DRILL || DRILL === d + "|" + r.id).map(([d, r]) => `<div class="diff"><b>${d} · ${esc(r.id)}</b> (${r.failures})<ul>${r.rows.map((x) => `<li>${esc(x.name)} · day ${x.day} · ${x.ch} ${esc(x.time)} · ${esc(x.id)}: ${esc(x.title)} ${esc(x.note)}</li>`).join("")}</ul></div>`).join("")}` : `<p class="ok">No rule failures recorded.</p>`}` : `<p class="muted">No test results recorded yet.</p>`}</section>`;
  document.getElementById("range").onchange = (e) => { RANGE = e.target.value; render(); };
}
document.addEventListener("click", (e) => { const t = e.target.closest("[data-drill]"); if (t) { e.preventDefault(); DRILL = t.dataset.drill; render(); } });
Promise.all([fetch("../data/log.json", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).catch(() => null), fetch("../data/tests.json", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).catch(() => null)]).then(([l, t]) => {
  if (!l) { const d = todayIST(); l = { generated: new Date().toISOString(), days: { [d]: deliveriesFor(d) } }; }
  LOG = l; TESTS = t; render();
});
