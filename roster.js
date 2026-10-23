// Test realtors. start = their day 1 (Asia/Calcutta calendar date).
var LOG_START = "2026-10-23";
var ROSTER = [
  { id: "R01", name: "Aisha (never opens)", start: "2026-10-23", persona: "Never opens the app", pay: "Not paid (free)", cond: "Never opened" },
  { id: "R02", name: "Omar (never opens, older)", start: "2026-10-01", persona: "Never opens the app", pay: "Not paid (free)", cond: "Never opened" },
  { id: "R03", name: "Priya (late starter)", start: "2026-10-21", persona: "Late starter (opens day 5)", pay: "Not paid (free)", cond: "Late starter" },
  { id: "R04", name: "Rahul (free, active)", start: "2026-10-23", persona: "Ideal user", pay: "Not paid (free)", cond: "Not paid, active" },
  { id: "R05", name: "Fatima (ignores features)", start: "2026-10-20", persona: "Opens, ignores features", pay: "Not paid (free)", cond: "Ignores features" },
  { id: "R06", name: "Daniel (trial, won't pay)", start: "2026-10-19", persona: "Ideal user", pay: "Trial, doesn't pay", cond: "Trial → expired" },
  { id: "R07", name: "Mei (trial, pays)", start: "2026-10-18", persona: "Ideal user", pay: "Trial, then pays", cond: "Trial → paid" },
  { id: "R08", name: "Yusuf (trial, new)", start: "2026-10-23", persona: "Ideal user", pay: "Trial, doesn't pay", cond: "Trial active" },
  { id: "R09", name: "Sara (paid, active)", start: "2026-10-10", persona: "Ideal user", pay: "Paid, renews", cond: "Paid active → renews" },
  { id: "R10", name: "Karim (paid, inactive)", start: "2026-10-12", persona: "Active, then slips (day 8)", pay: "Paid, then inactive", cond: "Paid but inactive" },
  { id: "R11", name: "Leila (payment fails)", start: "2026-10-15", persona: "Ideal user", pay: "Paid, payment fails", cond: "Payment failed → expired" },
  { id: "R12", name: "Arjun (cancels)", start: "2026-10-13", persona: "Ideal user", pay: "Paid, then cancels", cond: "Cancelled → expired" },
  { id: "R13", name: "Noura (slipping)", start: "2026-10-16", persona: "Active, then slips (day 8)", pay: "Not paid (free)", cond: "Slipping → returns" },
  { id: "R14", name: "Hassan (dormant)", start: "2026-09-25", persona: "Dormant (stops day 3)", pay: "Not paid (free)", cond: "Dormant 30+ days" },
  { id: "R15", name: "Elena (dormant, trial lapsed)", start: "2026-10-05", persona: "Dormant (stops day 3)", pay: "Trial, doesn't pay", cond: "Dormant, trial expired" },
  { id: "R16", name: "Vikram (closes a deal)", start: "2026-10-16", persona: "Deal closer (closes day 10)", pay: "Paid, renews", cond: "Deal closed → referral" },
  { id: "R17", name: "Zara (deal, free)", start: "2026-10-20", persona: "Deal closer (closes day 10)", pay: "Not paid (free)", cond: "Deal closed, not paid" },
  { id: "R18", name: "Ahmed (brokerage owner)", start: "2026-10-14", persona: "Ideal user", pay: "Paid, renews", team: true, cond: "Brokerage owner" },
  { id: "R19", name: "Grace (owner, quiet)", start: "2026-10-17", persona: "Weekend opener", pay: "Paid, then inactive", team: true, cond: "Brokerage owner, rarely active" },
  { id: "R20", name: "Ravi (no WhatsApp)", start: "2026-10-19", persona: "Ideal user", pay: "Trial, then pays", optout: ["WhatsApp"], cond: "Opted out: WhatsApp" },
  { id: "R21", name: "Lina (no push)", start: "2026-10-18", persona: "Active, then slips (day 8)", pay: "Not paid (free)", optout: ["Push"], cond: "Opted out: push" },
  { id: "R22", name: "Tom (email only)", start: "2026-10-21", persona: "Ideal user", pay: "Not paid (free)", optout: ["Push", "WhatsApp"], cond: "Email + in-app only" },
  { id: "R23", name: "Maryam (course learner)", start: "2026-10-19", persona: "Course learner", pay: "Trial, then pays", cond: "Completes a course" },
  { id: "R24", name: "Imran (weekend opener)", start: "2026-10-12", persona: "Weekend opener", pay: "Not paid (free)", cond: "Irregular user" },
  { id: "R25", name: "Sofia (tight cap)", start: "2026-10-17", persona: "Ideal user", pay: "Not paid (free)", cap: 3, cond: "Daily cap 3" },
  { id: "R27", name: "Nadia (zero leads, uses courses)", start: "2026-10-20", persona: "Zero leads (uses other features)", pay: "Not paid (free)", cond: "Zero leads in CRM" },
  { id: "R28", name: "Faisal (zero leads, rarely opens)", start: "2026-10-18", persona: "Zero leads, rarely opens", pay: "Trial, doesn't pay", cond: "Zero leads, rarely opens" },
  { id: "R29", name: "Ritu (only 1 lead)", start: "2026-10-16", persona: "Only 1 lead", pay: "Not paid (free)", cond: "Only 1 lead" },
  { id: "R30", name: "Jamal (leads not updated)", start: "2026-10-15", persona: "Leads not updated (5+ days)", pay: "Paid, then inactive", cond: "Leads not updated 5+ days" },
  { id: "R26", name: "Bilal (Ramadan timing)", start: "2026-10-20", persona: "Ideal user", pay: "Trial, doesn't pay", ramadan: true, cond: "Ramadan timing" },
];
function featureOf(m) {
  const p = m.id.split("-")[0];
  if (m.id === "PROMO") { const x = /Door: ([^.]+)\./.exec(m.why); return x ? x[1].trim() : "Feature nudge"; }
  return ({ MC: "Morning Coach", OLC: "One-Lead", HAB: "Streak", ACC: "Onboarding", WB: "Win-back", SLP: "Re-entry", PAY: "Payments", IMP: "Payments", REF: "Referral", TEAM: "Team", CRM: "CRM", LRN: "Courses", LAB: "Live Labs", "WA": "Objection (WhatsApp)", VAL: "Value", OFFER: "Offer" })[p] || p;
}
function dayIdx(start, date) { return Math.round((Date.parse(date + "T00:00:00Z") - Date.parse(start + "T00:00:00Z")) / 864e5) + 1; }
function deliveriesFor(date) {
  const out = [];
  for (const u of ROSTER) {
    const d = dayIdx(u.start, date); if (d < 1) continue;
    const sim = simulate(d, PERSONAS[u.persona], { ramadan: !!u.ramadan, cap: u.cap || 4, team: !!u.team, pay: u.pay, optout: u.optout || [] });
    for (const m of sim.msgs.filter((x) => x.day === d)) out.push({ date, user: u.id, name: u.name, cond: u.cond, day: d, ch: m.ch, time: m.time, id: m.id, title: m.title, body: m.body, why: m.why, kind: m.kind, feature: featureOf(m), status: m.sup ? "Suppressed" : "Sent", sup: m.sup || "", pay: sim.state["Payment status"] });
  }
  return out;
}
function todayIST() { return new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10); }
if (typeof module !== "undefined") module.exports = { ROSTER, LOG_START, deliveriesFor, todayIST, dayIdx };
