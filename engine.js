const FEATS = [
  { key: "coach", name: "Morning Coach", promo: [["That call you keep delaying?", "Your coach has the first line ready. 2 minutes."], ["Who should you call first today?", "Open the plan. One name, three steps."]] },
  { key: "crm", name: "DealFlow CRM", promo: [["Khalid: no touch in 7 days", "Silence isn't a no. Here's a 2-line message that isn't copy-paste."], ["Where do your leads leak?", "See which stage loses you the most clients. One screen."]] },
  { key: "scripts", name: "Scripts", promo: [["What do you say after \"let me think\"?", "We have the exact line. Tap to copy."], ["Client went silent? Try this", "A 2-line WhatsApp that doesn't sound like a template."]] },
  { key: "market", name: "Market (DealRadar)", promo: [["Dubai today: {headline}", "Use it as your opening line on the first call."], ["1 real sale to send a client today", "Pitch Client turns a DLD sale into a reason to talk."]] },
  { key: "mission", name: "Daily Mission", promo: [["Today's mission: 3 call-backs", "10 minutes. It moves Khalid one step."], ["Half the day left", "Your mission takes 10 min. Do it before the 4 PM call rush."]] },
  { key: "courses", name: "Courses", promo: [["2-minute lesson: before you dial", "For the voice-shaking calls after 10 no's."], ["You stopped halfway", "The best part is next: the exact words. 3 min left."]] },
  { key: "ebooks", name: "E-books", promo: [["Free for you: The Follow-up Fortune", "For every client who said \"later\". 12-min read."], ["Month-end tight? Read War Time", "The plan for when the pipeline is thin."]] },
  { key: "labs", name: "Live Labs", promo: [["Live Lab: {lab_title}", "Bring your toughest client. We'll fix the call live."], ["Missed it? Replay is up", "The 8-minute part on call-backs is worth it."]] },
  { key: "deal", name: "Deal Room", promo: [["Got an offer on the table?", "Put it in Deal Room. Get the counter-offer script before you reply."], ["Khalid's deal has gone quiet", "Most stuck deals need one call, not one more message."]] },
  { key: "ai", name: "Reven AI", promo: [["Stuck on what to reply?", "Paste the client's message. Get a reply that sounds like you."], ["Write tonight's follow-ups in 1 minute", "Tell Reven who and why. It drafts the words."]] },
  { key: "brand", name: "Personal Branding", promo: [["Let clients find you", "Connect Instagram once. We draft the posts."], ["Your post draft is ready", "Approve today's draft before it goes live."]] },
];
const ANGLES = ["Pain", "Curiosity", "Social proof", "Quick win", "Value gift", "Coach check-in"];
const OBJ = [
  ["\"It's too expensive.\"", "Pause. Ask: \"Compared to what?\" Show value before you touch the price. Hold on the first push back."],
  ["\"Let me think about it.\"", "Ask: \"What's the one thing you're still unsure about?\" Then book a 10-min call within 48 hours."],
  ["\"Send me details on WhatsApp.\"", "Say: \"Sure. Two quick questions first so I send only what fits.\" Keep them talking."],
  ["\"I'm working with another agent.\"", "Say: \"No problem. If something off-market comes up in your area, can I share it?\" Leave the door open."],
  ["\"Prices will drop, I'll wait.\"", "Share one recent DLD sale in their area. Ask: \"What price would make you move?\""],
  ["\"Call me next month.\"", "Say: \"Happy to. What will be different next month?\" Put a date in the CRM now."],
  ["No reply for a week.", "Don't send a long message. One line: \"Is this still a priority, or should I close your file?\""],
];
const VALUE = [
  ["E-book", "Free: The Follow-up Fortune", "Most deals are lost on the call-back you delayed, not the first call. This 12-minute read shows a simple follow-up rhythm you can start today. Open it in the app: E-books."],
  ["Tip", "The 48-hour rule after \"I'll think about it\"", "After 48 hours most clients forget why they were excited. Call before then with one question about what they said. Your script is in Scripts."],
  ["Market", "This week's busiest area: {area_name}", "{stat_units} units sold this week. Three clients in your CRM may care. Open DealRadar to send one sale in one tap."],
  ["E-book", "Free: Beginner Roadmap", "New to Dubai real estate or restarting? A plain 30-day plan: who to call, what to learn, what to skip. Open it in E-books."],
  ["Tip", "Stand up when you call", "Your voice sounds steadier on your feet. Try it on your first call tomorrow and log how it went."],
];
const OFFERS = [
  ["Keep your CRM. Coach one lead free.", "Add the client you keep putting off. We'll coach you on that one lead from first call to keys, free. If it helps, unlock all your leads later."],
  ["Unlock all your leads", "Your one lead is moving. Bring the rest in: import one Excel and tomorrow's plan covers all of them. {package_name}, cancel anytime."],
];
const STAGES = ["None", "Cold Calling", "Follow-up", "Client Meeting", "Negotiation", "Closure"];
const COACH = {
  "Cold Calling": "Today: 5 calls before 11 AM. Say your name and one useful Dubai fact, ask one question, book a 10-min follow-up.",
  "Follow-up": "Call Khalid first, not WhatsApp. Mention what he said last time, ask what's stopping him, set a date.",
  "Client Meeting": "Meeting with Khalid. Ask 3 questions before showing anything. Show max 3 units.",
  "Negotiation": "Khalid said \"too expensive\". Pause, ask what he's comparing to, show value before price.",
  "Closure": "Close Khalid this week. Confirm budget and mortgage, send the MOU today, book the transfer date.",
};

const PERSONAS = {
  "Ideal user": (d) => ({ opened: true, used: FEATS[(d - 1) % FEATS.length].key, calls: 3, stage: STAGES[Math.min(5, 1 + Math.floor((d - 1) / 5))] }),
  "Never opens the app": () => ({ opened: false, used: "none", calls: 0, stage: "None" }),
  "Opens, ignores features": (d) => ({ opened: true, used: "none", calls: d % 3 === 0 ? 1 : 0, stage: d > 2 ? "Cold Calling" : "None" }),
  "Active, then slips (day 8)": (d) => d < 8 || d > 22 ? { opened: true, used: d > 22 ? "coach" : FEATS[(d - 1) % 4].key, calls: 2, stage: d > 4 ? "Follow-up" : "Cold Calling" } : { opened: false, used: "none", calls: 0, stage: "Follow-up" },
  "Late starter (opens day 5)": (d) => d < 5 ? { opened: false, used: "none", calls: 0, stage: "None" } : { opened: true, used: d % 2 ? "crm" : "coach", calls: 2, stage: "Cold Calling" },
};

const PAYS = ["Not paid (free)", "Trial, doesn't pay", "Trial, then pays", "Paid, then inactive", "Paid, payment fails", "Paid, then cancels", "Paid, renews"];
const ACT = { "MC-01": "today-plan", "MC-02": "today-plan", "OLC-03": "today-plan", "MC-03": "call-log", "HAB-03": "call-log", "ACC-03": "welcome", "WB-02": "welcome", "SLP-03": "re-entry", "SLP-07": "re-entry", "SLP-14": "re-entry", "SLP-30": "re-entry", "PAY-08": "re-entry" };
const SCREENS = {
  coach: ["Today's plan", "Who to call: Khalid (Follow-up)", "Steps: mention last talk, ask what's stopping him, set a date", "Do: call before 2 PM", "Don't: send the same copy-paste message to 20 people"],
  crm: ["DealFlow CRM", "Cold Calling · Follow-up · Client Meeting · Negotiation · Closure", "Khalid: next contact today 11 AM", "Quiet 7+ days: {n} clients", "Your leak stage: {weak_stage}"],
  olc: ["One-Lead Challenge", "One lead coached free, first call to keys", "Keep your current CRM", "Progress: added → called → meeting → closed"],
  mission: ["Daily Mission", "Today: 3 call-backs (10 min)", "Practice: say the \"too expensive\" answer out loud", "Morning focus session: 2 min"],
  streak: ["Streak & weekly report", "Streak counts logged calls", "Weekly growth report: Sun 7 PM", "Market Price Guess: 60 sec"],
  scripts: ["Scripts", "Silent buyer (WhatsApp)", "\"Too expensive\" (call)", "\"Let me think\" (call)", "Cold call opener"],
  market: ["Market", "DealRadar: DLD sales with filters and alerts", "Market Pulse: today's headline", "Pitch Client: send a sale in one tap"],
  courses: ["Courses", "Cold Calling Mastery: 17 lessons", "Million Dirham course: 14 days", "Video, PDF guide, workbook, audio"],
  ebooks: ["E-books", "Beginner Roadmap", "High-Ticket Sales Blueprint", "War Time", "Follow-up Fortune"],
  labs: ["Live Labs", "This week: {lab_title}", "Replays", "Free masterclass"],
  deal: ["Deal Room", "Offers and counter-offer scripts", "Negotiation notes", "Closing checklist: 6 items"],
  ai: ["Reven AI", "Paste a client message, get a reply in your voice", "Daily limit: {tokens}"],
  brand: ["Personal Branding", "Connect Instagram", "Drafts to approve", "Schedule and reach"],
  refer: ["Refer & team", "Your win card: share after a closed deal", "Friend gets one lead coached free; you both get {reward}", "Team trial for your brokerage"],
  profile: ["Profile & settings", "Quarter goal: {goal}", "Plan: Consultant / Rainmaker / Titan", "Notification settings: quiet hours 9 PM–8 AM, time zone, Ramadan timing, Friday off", "Payments and support chat"],
};
const TABNAME = { coach: "Coach", crm: "CRM", olc: "One-Lead", mission: "Mission", streak: "Streak", scripts: "Scripts", market: "Market", courses: "Courses", ebooks: "E-books", labs: "Labs", deal: "Deal Room", ai: "Reven AI", brand: "Branding", refer: "Refer", profile: "Profile" };
const SIG = "\n\nYour coach, RealtorOne";

function payStatus(pay, rel, inactive) {
  if (rel < 0) return "Not paid";
  const paidish = (s) => (inactive >= 3 && s === "Paid active" ? "Paid but inactive" : s);
  switch (pay) {
    case "Not paid (free)": return "Not paid";
    case "Trial, doesn't pay": case "Trial, then pays":
      if (rel < 4) return "Trial active"; if (rel === 4) return "Trial ends in 3 days"; if (rel < 6) return "Trial active";
      if (rel === 6) return "Trial ends tomorrow"; if (rel === 7) return pay === "Trial, then pays" ? "Paid active" : "Trial ends today";
      return pay === "Trial, then pays" ? paidish("Paid active") : "Trial expired";
    case "Paid, then inactive": return paidish("Paid active");
    case "Paid, payment fails": if (rel < 10) return paidish("Paid active"); if (rel < 15) return "Payment failed"; return "Expired";
    case "Paid, then cancels": if (rel < 12) return paidish("Paid active"); if (rel < 19) return "Cancelled (access till end date)"; return "Expired";
    case "Paid, renews": if (rel < 30) return paidish("Paid active"); return paidish("Renewed");
  }
  return "Not paid";
}

function simulate(days, beh, opt) {
  const msgs = [];
  let activated = false, firstOpen = 0, inactive = 0, streak = 0, activeDays = 0, angle = 0, valueSent = 0, offersSent = 0, lastOffer = -99, obj = 0, val = 0, lastPromo = "", leadAdded = false, unopenedLadder = 0;
  const tried = new Set(), ignored = {};
  let acts = new Set(), chans = new Set(), sent = 0, holiday = false, closed = false, courseUses = 0, refDay = -1, status = "Not paid";
  const add = (day, time0, ch, id, title, body, why, kind) => {
    const act = ACT[id] || (id.startsWith("PAY") || id.startsWith("IMP") ? "money" : id);
    let time = time0;
    if (opt.ramadan && ch !== "In-app" && !time0.startsWith("On")) time = time0.endsWith("AM") ? "10:30 AM" : "8:30 PM (after Iftar)";
    const cap = Math.max(1, (opt.ramadan ? 3 : opt.cap) - (holiday ? 2 : 0));
    const live = kind === "Milestone" && ch === "In-app";
    let sup = "";
    if ((opt.optout || []).includes(ch)) sup = `Suppressed (opted out): this realtor turned off ${ch}.`;
    else if (acts.has(act)) sup = `Suppressed (duplicate): this activity (${act}) already reached the realtor today.`;
    else if (chans.has(ch) && !live) sup = `Suppressed (duplicate): ${ch} already used today for a different job. One role per channel per day.`;
    else if (sent >= cap && !live) sup = `Suppressed (daily cap): ${cap} messages already sent today${holiday ? " (holiday: lighter cap)" : opt.ramadan ? " (Ramadan cap)" : ""}.`;
    else if (holiday && kind === "Offer") sup = "Suppressed: no offers on public holidays.";
    if (!sup) { acts.add(act); chans.add(ch); sent++; }
    msgs.push({ day, time, ch, id, title, body, why, kind, sup: sup || undefined });
  };
  for (let d = 1; d <= days; d++) {
    const b = beh(d);
    holiday = !!b.holiday; acts = new Set(); chans = new Set(); sent = 0;
    const rel = activated ? d - firstOpen : -1;
    status = payStatus(opt.pay, rel, inactive);
    // priority 1: money (one money message a day max)
    if (activated) {
      const P = opt.pay, tr = P.startsWith("Trial");
      if (tr && rel === 4) add(d, "10:00 AM", "Push", "PAY-T3", "3 days left in your trial", "Your leads and morning plans are set up. Keep going: one call today.", "Trial ends in 3 days: calm reminder, value first.", "Money");
      if (tr && rel === 6) add(d, "10:00 AM", "Email", "PAY-01", "Trial ends tomorrow", "Hi Guru,\n\nYour trial ends tomorrow. Your tracked leads and morning plans stay if you continue." + SIG, "Trial D-1.", "Money");
      if (P === "Trial, doesn't pay" && rel === 7) add(d, "10:00 AM", "Push", "PAY-02", "Last day of your trial", "Keep your coach, Deal Room and leads. One deal pays for the year.", "Trial D0.", "Money");
      if (P === "Trial, doesn't pay" && rel === 8) add(d, "10:00 AM", "Email", "PAY-03", "Guru, your leads are still here", "Hi Guru,\n\nYour trial has ended, but nothing is lost. Khalid and your notes are saved. Pick up where you left off: {link_url}" + SIG, "Trial expired, not paid (D+1).", "Money");
      if (P === "Trial, doesn't pay" && rel === 14) add(d, "11:00 AM", "Email", "WB-01", "{stat_deals} deals closed by RealtorOne agents this month", "Hi Guru,\n\nAgents like you, starting with one lead. Come back free for 7 days: {link_url}" + SIG, "Trial expired 7 days ago: win-back offer.", "Money");
      if ((P === "Trial, then pays" && rel === 7) || (!tr && P !== "Not paid (free)" && rel === 0)) add(d, "On pay", "In-app", "PAY-06", "All your leads are unlocked", "Import your CRM list. Tomorrow's plan covers all of them.", "Paid: welcome to the full plan.", "Milestone");
      if ((P === "Trial, then pays" && rel === 8) || (!tr && P !== "Not paid (free)" && rel === 1)) add(d, "10:00 AM", "Email", "IMP-01", "Bring your leads from your old CRM", "Hi Guru,\n\nUpload one Excel and tomorrow's plan covers every lead, not just Khalid." + SIG, "Paid +1 day: import so the plan covers real leads.", "Money");
      if (status === "Paid but inactive" && inactive === 4) add(d, "10:00 AM", "Push", "PAY-08", "Your plan is active. Khalid is waiting", "One call today makes this week count. Your line is ready.", "Paid but inactive 4 days: their own lead, no guilt.", "Money");
      if (P === "Paid, payment fails" && rel === 10) add(d, "10:00 AM", "Email", "PAY-05", "Action needed on your payment", "Hi Guru,\n\nYour last payment didn't go through. Update your card so your morning plans don't stop: {link_url}" + SIG, "Payment failed.", "Money");
      if (P === "Paid, payment fails" && rel === 12) add(d, "10:00 AM", "Push", "PAY-05", "Your payment still needs a fix", "Update your card in 1 minute. Your plans continue.", "Payment failed +2 days: retry on another channel.", "Money");
      if (P === "Paid, then cancels" && rel === 12) add(d, "On cancel", "Email", "PAY-09", "Your plan is cancelled", "Hi Guru,\n\nDone. You keep full access until {end_date}. If something didn't work for you, just reply and tell us." + SIG, "Cancelled: confirm, no pressure.", "Money");
      if ((P === "Paid, payment fails" && rel === 15) || (P === "Paid, then cancels" && rel === 19)) add(d, "10:00 AM", "Email", "PAY-07", "Your access has ended", "Hi Guru,\n\nYour history is saved. Restart anytime: {link_url}" + SIG, "Subscription expired.", "Money");
      if (P === "Paid, renews" && rel === 27) add(d, "10:00 AM", "Email", "PAY-11", "Your plan renews in 3 days", "Hi Guru,\n\nNo action needed. Here's your month: {calls} calls, {deals} deals." + SIG, "Renewal in 3 days: show value, no surprise charge.", "Money");
      if (P === "Paid, renews" && rel === 30) add(d, "On renew", "In-app", "PAY-10", "Renewed. Thank you, Guru", "Next month's plans are ready. Set this month's target in 30 seconds.", "Renewed.", "Milestone");
    }
    // priority 2: referral & team
    if (d === refDay) add(d, "11:00 AM", "Email", "REF-01", "Share your win card?", "Hi Guru,\n\nYou closed with Khalid. A friend who is where you were a few months ago gets one lead coached free from your card. You both get {reward}." + SIG, "Referral: day after a closed deal, when the realtor feels good.", "Referral");
    if (activated && activeDays === 14 && b.opened) add(d, "7:00 PM", "Email", "REF-03", "Want this for your whole team?", "Hi Guru,\n\nTwo weeks of daily calls. If your manager or team would use the same morning plan, send them the team trial in one tap." + SIG, "14 active days: brokerage/team invite.", "Referral");
    if (opt.team && activated && d % 7 === 0) add(d, "7:00 PM", "Email", "TEAM-01", "Your team this week", "Hi Guru,\n\nCalls logged by your team: {team_calls}. Leads stuck at Follow-up: {team_stuck}. One agent to check in with: {agent_name}.\n\nRealtorOne", "Brokerage owner: weekly team digest instead of personal nurture.", "Team");
    if (!activated) {
      if (!b.opened) {
        unopenedLadder++;
        const n = unopenedLadder;
        if (n === 1) add(d, "11:00 AM", "Push", "ACC-01", "That call you're dreading?", "Sign up in 30 sec and get the exact first line to say tomorrow morning.", "App never opened: re-entry nudge, no welcome yet.", "Re-entry");
        else if (n === 2) add(d, "10:00 AM", "Push", "ACC-02", "One lead. Zero cost.", "Track one lead free from first call to closing. Keep your CRM.", "Push 1 unopened: new angle (quick win), new time.", "Re-entry");
        else if (n === 4) add(d, "6:00 PM", "Email", "ACC-05", "Still chasing leads from memory?", "Hi Guru,\n\nMost agents lose a deal not on the first call but on the call-back they forgot. Add one lead in RealtorOne and we'll remind you at the right time, with the right words.\n\nIt takes 10 seconds: one name." + SIG, "2 pushes unopened: switch channel to email.", "Re-entry");
        else if (n === 7) add(d, "10:00 AM", "WhatsApp", "SLP-14", "Rough week?", "It happens to everyone. Reply YES and I'll send you a 5-minute plan for one lead.", "Email unopened: last try on WhatsApp (opt-in only).", "Re-entry");
        else if (n > 7 && n % 7 === 0) add(d, "10:00 AM", "Email", "SLP-30", "Your account is saved, Guru", "Hi Guru,\n\nWhenever you're ready, start with one call. Your coach will be there.\n\nRealtorOne", "Sunset rule: 7 unopened → once a week only.", "Re-entry");
        continue;
      }
      activated = true; firstOpen = d;
      status = payStatus(opt.pay, 0, 0);
      add(d, "On open", "In-app", "ACC-03", "Welcome, Guru. Let's start with one lead.", "Add the client you keep putting off. Tomorrow 8 AM your coach tells you exactly what to say.", "First open: welcome only now, never before.", "Welcome");
      add(d, "On open", "Email", "ACC-03", "Welcome, Guru. Let's start with one lead.", "Hi Guru,\n\nYou don't need another app that sends reminders. You need someone to tell you what to say when the client goes quiet.\n\nStart small: add one lead today. Tomorrow at 8 AM you'll get who to call first, three steps, and one thing not to say." + SIG, "Welcome email would repeat the in-app welcome.", "Welcome");
      if (opt.pay !== "Not paid (free)" && !opt.pay.startsWith("Trial")) add(d, "On pay", "In-app", "PAY-06", "All your leads are unlocked", "Import your CRM list. Tomorrow's plan covers all of them.", "Paid on day one.", "Milestone");
    } else {
      if (inactive === 0 || inactive === 1) {
        if (leadAdded) add(d, "8:00 AM", "Push", "MC-01", "Today: call Khalid first", COACH[b.stage === "None" ? "Follow-up" : b.stage] || COACH["Follow-up"], "Daily Morning Coach, only once a lead exists.", "Daily");
        else add(d, "8:00 AM", "Push", "OLC-03", "Who's the client you keep delaying?", "Add their name. That's it. We do the rest at 8 AM.", "Active but no lead yet: ask for the one name instead of a plan.", "Daily");
      }
      if (inactive === 3) add(d, "10:00 AM", "Push", "SLP-03", "Khalid hasn't heard from you", "One message today keeps him warm. It's written.", "3 days inactive: their own lead, not a generic 'we miss you'.", "Slipping");
      if (inactive === 7) { add(d, "10:00 AM", "Push", "SLP-07", "A week of silence, Guru", "Your leads go to the agent who calls back. 1 call today.", "7 days inactive.", "Slipping"); add(d, "6:00 PM", "Email", "SLP-07", "A week of silence, Guru", "Hi Guru,\n\nKhalid was at Follow-up when you last checked. A short call today is usually enough to restart." + SIG, "Email version of the same D7 re-entry.", "Slipping"); }
      if (inactive === 14) add(d, "10:00 AM", "WhatsApp", "SLP-14", "Rough month?", "It happens to everyone. Restart with one lead. Reply YES and I'll send your plan.", "14 days inactive: WhatsApp.", "Slipping");
      if (inactive === 30) add(d, "10:00 AM", "Email", "SLP-30", "Your history is saved", "Hi Guru,\n\nMonth-end coming? Start with one call. Everything is where you left it.\n\nRealtorOne", "30 days inactive: monthly only after this.", "Slipping");
      if (b.opened && inactive >= 3) add(d, "On open", "In-app", "WB-02", "Welcome back, Guru", "Pick up where you left off: today's first call is Khalid.", "Returned after slipping.", "Welcome back");
      if (inactive < 3) {
        if (lastPromo && !tried.has(lastPromo)) ignored[lastPromo] = (ignored[lastPromo] || 0) + 1;
        const pick = FEATS.filter((f) => !tried.has(f.key) && f.key !== lastPromo && (ignored[f.key] || 0) < 2)[0];
        if (pick) {
          const v = pick.promo[Math.min(1, ignored[pick.key] || 0)];
          const ag = ANGLES[angle % ANGLES.length]; angle++;
          const prev = FEATS.find((f) => f.key === lastPromo);
          add(d, b.opened ? "On open" : "11:00 AM", b.opened ? "In-app" : "Push", "PROMO", v[0], v[1], lastPromo ? `${prev ? prev.name : lastPromo} not used yesterday, so today: different feature (${pick.name}), angle: ${ag}.` : `First untried feature: ${pick.name}, angle: ${ag}.`, "Feature nudge");
          lastPromo = pick.key;
        }
      }
      if (!b.opened && inactive < 2) add(d, "12:30 PM", "Push", "MC-02", "Your first call is still waiting", "Khalid is warmest before 2 PM. Your line is ready.", "Plan not opened by 12:30.", "Daily");
    }
    if (b.opened) {
      if (b.used !== "none") tried.add(b.used);
      if (b.used === "crm" || b.stage !== "None") { if (!leadAdded) add(d, "On add", "In-app", "OLC-05", "Got it. Khalid is tracked", "Tomorrow 8 AM: your opening line, 3 steps, and one thing not to say.", "First lead added.", "Milestone"); leadAdded = true; }
      activeDays++; inactive = 0;
      if (b.calls > 0) { streak++; if ([3, 7, 14, 30].includes(streak)) add(d, "On log", "In-app", "HAB-05", `${streak} days of calls in a row`, "Streak counts calls you logged, not app opens. Keep going.", "Streak milestone.", "Milestone"); }
      else { if (streak >= 3) add(d, "7:00 PM", "Push", "HAB-03", `Protect your ${streak}-day streak`, "One call logged keeps it. Even a 2-minute one.", "Opened but no calls logged; streak at risk.", "Daily"); else add(d, "6:00 PM", "Push", "MC-03", "How did today's calls go?", "Tap the result. 5 seconds. Tomorrow's plan gets sharper.", "No calls logged by 6 PM.", "Daily"); streak = 0; }
    } else if (activated) { inactive++; streak = 0; }
    if (b.opened && b.used === "courses") { courseUses++; if (courseUses === 3) add(d, "On finish", "In-app", "LRN-03", "Course done. Try one line on Khalid today", "You finished the lesson set. Use one line from it on your next call and log how it went.", "Completed a course: turn learning into a call.", "Milestone"); }
    if (b.opened && b.stage === "Closure" && b.calls > 0 && !closed) { closed = true; refDay = d + 1; add(d, "On close", "In-app", "CRM-06", "Closed. Well done, Guru", "That's a deal done. Take a minute, then tomorrow's plan picks the next lead.", "Closed a deal: celebrate first, no ask today.", "Milestone"); }
    if (activated && inactive < 3 && d > firstOpen) {
      const o = OBJ[obj % OBJ.length]; obj++;
      add(d, "12:00 PM", "WhatsApp", "WA-OBJ", `Today's objection: ${o[0]}`, `How to handle it today: ${o[1]}`, "WhatsApp role: one objection + the fix to use today.", "Value");
      const canOffer = /Not paid|Trial|expired|Expired/.test(status);
      const offerOk = canOffer && activeDays >= 3 && valueSent >= 3 && valueSent >= (offersSent + 1) * 4 - 1 && d - lastOffer >= 3;
      if (offerOk && offersSent < OFFERS.length) { const of = OFFERS[offersSent]; add(d, "7:00 PM", "Email", "OFFER", of[0], `Hi Guru,\n\n${of[1]}` + SIG, `Offer allowed: ${activeDays} active days, ${valueSent} value messages first (4:1 rule), status: ${status}.`, "Offer"); offersSent++; lastOffer = d; }
      else if ((d - firstOpen) % 2 === 1) { const v = VALUE[val % VALUE.length]; val++; valueSent++; add(d, "6:30 PM", "Email", "VAL", v[1], `Hi Guru,\n\n${v[2]}` + SIG, `Value (${v[0]}) after activation, no pitch.`, "Value"); }
      else valueSent++;
    }
  }
  return { msgs, state: { "Payment status": status, "Opened ever": activated ? `Yes, day ${firstOpen}` : "No", "Lead added": leadAdded ? "Yes" : "No", "Call streak": `${streak} days`, "Days inactive": `${inactive}`, "Active days": `${activeDays}`, "Features tried": `${tried.size} of ${FEATS.length}`, "Value / offers sent": `${valueSent} / ${offersSent}`, "Deal closed": closed ? "Yes" : "No", "Courses opened": `${courseUses}`, "Suppressed so far": `${msgs.filter((m) => m.sup).length}` } };
}


const EXTRA = {
  "Dormant (stops day 3)": (d) => d < 3 ? { opened: true, used: "coach", calls: 1, stage: "Cold Calling" } : { opened: false, used: "none", calls: 0, stage: "Cold Calling" },
  "Deal closer (closes day 10)": (d) => ({ opened: true, used: ["crm", "deal", "scripts"][d % 3], calls: 2, stage: d < 4 ? "Follow-up" : d < 7 ? "Negotiation" : "Closure" }),
  "Course learner": (d) => ({ opened: true, used: "courses", calls: d % 2, stage: "Cold Calling" }),
  "Weekend opener": (d) => d % 7 === 5 || d % 7 === 6 ? { opened: true, used: "market", calls: 1, stage: "Follow-up" } : { opened: false, used: "none", calls: 0, stage: "Follow-up" },
};
Object.assign(PERSONAS, EXTRA);
if (typeof module !== "undefined") module.exports = { simulate, PERSONAS, FEATS, PAYS, payStatus };
