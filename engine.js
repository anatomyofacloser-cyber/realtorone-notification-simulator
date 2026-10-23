const FEATS = [
  { key: "coach", name: "Morning Coach", promo: [["The call you keep dodging? Line's ready", "Your coach wrote the first sentence. 2 minutes, then dial.", "Open plan"], ["Who do you call first today?", "One name, three steps, one thing not to say.", "See today's name"]] },
  { key: "crm", name: "DealFlow CRM", promo: [["Marina viewing, then silence?", "Silence isn't a no. Find who went quiet and what to send.", "Open CRM"], ["Where do your deals leak?", "One screen shows the stage that loses you clients.", "Find my leak"]] },
  { key: "scripts", name: "Scripts", promo: [["\"Let me think\" again? Say this", "The exact reply that keeps the deal warm. Tap to copy.", "Copy line"], ["Blue ticks, no reply?", "A 2-line WhatsApp that doesn't read like a template.", "Copy nudge"]] },
  { key: "market", name: "Market (DealRadar)", promo: [["Slow morning? Steal this opener", "Dubai today: {headline}. Lead your first call with it.", "Use opener"], ["One real JVC sale. One reason to call", "Send a fresh DLD sale to a client in one tap.", "Pitch client"]] },
  { key: "mission", name: "Daily Mission", promo: [["Today's mission: 3 call-backs", "10 minutes. Moves Khalid one step closer to keys.", "Start mission"], ["Half the day left. 10 minutes needed", "Finish today's mission before the 4 PM call rush.", "Finish it"]] },
  { key: "courses", name: "Courses", promo: [["10 no's in a row? Watch this first", "2 minutes on keeping your voice steady before you dial.", "Play lesson"], ["You stopped right before the good part", "Next up: the exact words. 3 minutes left.", "Resume"]] },
  { key: "ebooks", name: "E-books", promo: [["For every client who said \"later\"", "The Follow-up Fortune. A 12-minute read, free for you.", "Read free"], ["Thin pipeline this month?", "War Time: the plan for slow weeks in Dubai.", "Read now"]] },
  { key: "labs", name: "Live Labs", promo: [["Bring your toughest client tonight", "Live Lab: {lab_title}. We fix the call live.", "Save seat"], ["Missed the Lab? Watch the 8 minutes", "The call-back part is worth your coffee break.", "Watch clip"]] },
  { key: "deal", name: "Deal Room", promo: [["Offer on the table? Don't reply yet", "Get the counter-offer script first, then answer.", "Open Deal Room"], ["Khalid's deal went quiet", "Stuck deals need one call, not one more WhatsApp.", "Plan the call"]] },
  { key: "ai", name: "Reven AI", promo: [["Stuck on what to reply?", "Paste the client's message. Get a reply in your voice.", "Write reply"], ["6 PM follow-ups in 60 seconds", "Tell Reven who and why. It drafts the words.", "Draft now"]] },
  { key: "brand", name: "Personal Branding", promo: [["Let clients find you first", "Connect Instagram once. We draft the posts for you.", "Connect"], ["Your post draft is ready to go", "Approve today's draft before it goes live.", "Review post"]] },
];
const ANGLES = ["Pain", "Curiosity", "Social proof", "Quick win", "Value gift", "Coach check-in"];
const OBJ = [
  ["It's too expensive.", "Pause. Ask \"Compared to what?\" and show value before you touch price."],
  ["Let me think about it.", "Ask \"What's the one thing you're unsure about?\" Then book 10 minutes within 48 hours."],
  ["Just send details on WhatsApp.", "\"Sure. Two quick questions first, so I only send what fits.\""],
  ["I'm working with another agent.", "\"No problem. If something off-market comes up in your area, can I share it?\""],
  ["Prices will drop. I'll wait.", "Share one recent DLD sale in their area, then ask \"What price would make you move?\""],
  ["Call me next month.", "\"Happy to. What will be different next month?\" Then put a date in the CRM."],
  ["(Blue ticks. No reply for a week.)", "Skip the essay. One line: \"Is this still a priority, or shall I close your file?\""],
];
const em = (hook, bullets, cta) => `Hi Guru,\n\n${hook}\n\n${bullets.map((b) => "• " + b).join("\n")}\n\n→ ${cta}`;
const VALUE = [
  ["E-book", "The call-back you delayed cost a deal", em("Most deals die on the call-back, not the first call.", ["The 48-hour follow-up rhythm", "3 lines that don't sound like chasing", "12-minute read, free"], "Read The Follow-up Fortune in E-books")],
  ["Tip", "Why \"I'll think about it\" goes cold", em("After 48 hours, clients forget why they were excited.", ["Call before the 48 hours are up", "Ask about one thing they said", "Your script is ready in Scripts"], "Open the \"let me think\" script")],
  ["Market", "This week's busiest area: {area_name}", em("{stat_units} units sold this week. Three of your clients may care.", ["Pick one sale from DealRadar", "Send it with one line of context", "Ask what they think of the price"], "Open DealRadar and pitch one client")],
  ["E-book", "Restarting in Dubai? Your 30-day map", em("New or restarting? Skip the noise.", ["Who to call in week one", "What to learn, what to skip", "Free: Beginner Roadmap"], "Open Beginner Roadmap in E-books")],
  ["Tip", "The 6 PM cold call trick", em("Your voice sounds steadier when you stand.", ["Stand up for your first call", "Smile on the first sentence", "Log how it went"], "Try it on tomorrow's first call")],
];
const OFFERS = [
  ["Keep your CRM. Get one lead coached free", em("That client you keep putting off? Let's coach just that one.", ["First call to keys, step by step", "Keep your current CRM", "Free, no card needed"], "Add your one lead")],
  ["Your one lead is moving. Bring the rest?", em("Khalid moved a stage. Imagine that across your whole list.", ["Import one Excel", "Every lead gets a morning plan", "{package_name}, cancel anytime"], "Unlock all your leads")],
];
const STAGES = ["None", "Cold Calling", "Follow-up", "Client Meeting", "Negotiation", "Closure"];
const COACH = {
  "Cold Calling": "5 calls before 11. Name, one Dubai fact, one question. Book 10 minutes.",
  "Follow-up": "Call, don't text. Mention last chat, ask what's stopping him, set a date.",
  "Client Meeting": "Ask 3 questions before showing anything. Max 3 units.",
  "Negotiation": "He said \"too expensive\". Pause, ask what he's comparing to.",
  "Closure": "Confirm mortgage, send the MOU today, book the transfer date.",
};
const COPY = {
  "ACC-01|Push": { t: "Viewing done. Client gone quiet?", b: "Get tomorrow's exact follow-up line. Sign up in 30 seconds." },
  "ACC-02|Push": { t: "One lead. Zero cost. Zero CRM drama.", b: "We coach one client free, first call to keys. Keep your old CRM." },
  "ACC-05|Email": { t: "The call-back you forgot cost a deal", b: em("Deals rarely die on the first call. They die on the forgotten call-back.", ["Add one client name", "We remind you at the right time", "With the right words"], "Add your first lead") },
  "SLP-14|WhatsApp": { t: "\"I'll restart next week.\"", b: "Fair. Start smaller: reply YES and I'll send one 5-minute plan for today." },
  "SLP-30|Email": { t: "Your history is saved, Guru", b: em("Slow month? It happens to every agent in Dubai.", ["Your leads and notes are where you left them", "Your coach is ready when you are"], "Make one call this week") },
  "ACC-03|In-app": { t: "Start with the client you keep delaying", b: "Add one name. At 8 AM you get the exact words. → Add lead" },
  "ACC-03|Email": { t: "Your first line for tomorrow, Guru", b: em("Reminders don't close deals. Knowing what to say does.", ["Add one lead today", "8 AM: who to call and what to say", "Plus one thing not to say"], "Add your first lead") },
  "MC-01|Push": { t: "Today: call Khalid first ☕" },
  "OLC-03|Push": { t: "Who's the client you keep delaying?", b: "Type one name. At 8 AM you get the exact words to say." },
  "SLP-03|Push": { t: "Khalid's last message: blue ticks", b: "Silence isn't a no. Your 2-line nudge is written. Send it." },
  "SLP-07|Push": { t: "Slow week? Restart with one call", b: "Your leads go to the agent who calls back. One call today." },
  "SLP-07|Email": { t: "Slow week? Here's a 1-call restart", b: em("Khalid was at Follow-up when you last checked.", ["One short call usually restarts it", "Your opening line: \"Did anything change on the JVC 2-bed?\""], "Call Khalid today") },
  "WB-02|In-app": { t: "Welcome back. Khalid is still warm", b: "Pick up exactly where you left off. → Call Khalid" },
  "MC-02|Push": { t: "Khalid is warmest before 2 PM", b: "Your opening line is ready. One tap, then dial." },
  "OLC-05|In-app": { t: "Khalid is tracked. Sleep easy", b: "8 AM: your opening line, 3 steps, one don't. → See plan" },
  "HAB-05|In-app": { t: (s) => `${s} days of calls. That's a habit`, b: "Your streak counts calls, not app opens. → Keep going" },
  "HAB-03|Push": { t: (s) => `Your ${s}-day streak needs one call`, b: "Even a 2-minute call counts. Log it and the day is yours." },
  "MC-03|Push": { t: "6 PM. How did the calls land?", b: "Tap the result. 5 seconds. Tomorrow's plan gets sharper." },
  "LRN-03|In-app": { t: "Course done. Use one line today", b: "Try it on Khalid's call, then log how it landed. → Open script" },
  "CRM-06|In-app": { t: "Closed. Keys handed. Well done 🔑", b: "Take a minute. Tomorrow's plan picks the next lead. → View win" },
  "PAY-T3|Push": { t: "3 trial days left. Make one count", b: "Your leads and morning plans are set. One call today." },
  "PAY-01|Email": { t: "Trial ends tomorrow. Keep your leads?", b: em("Your trial ends tomorrow. Everything you built stays if you continue.", ["Your tracked leads", "Your 8 AM plans", "Your Deal Room notes"], "Continue my plan") },
  "PAY-02|Push": { t: "Trial ends tonight", b: "Keep your coach, Deal Room and leads. One deal covers the year." },
  "PAY-03|Email": { t: "Khalid's file is still here", b: em("Your trial ended. Nothing is lost.", ["Leads and notes saved", "Pick up in one tap"], "Pick up where I left off: {link_url}") },
  "WB-01|Email": { t: "{stat_deals} deals closed. Why not yours?", b: em("Agents like you closed these starting with one lead.", ["Come back free for 7 days", "Your history is waiting"], "Restart free: {link_url}") },
  "PAY-06|In-app": { t: "All your leads are unlocked", b: "Import your list. Tomorrow's plan covers everyone. → Import" },
  "IMP-01|Email": { t: "Your old CRM leads, coached by tomorrow", b: em("Your plan only helps the leads it can see.", ["Upload one Excel", "Every lead gets an 8 AM plan"], "Import my leads") },
  "PAY-08|Push": { t: "Plan's active. Khalid is waiting", b: "One call today makes this week count. Your line is ready." },
  "PAY-05|Email": { t: "A card hiccup, fixed in 1 minute", b: em("Your last payment didn't go through.", ["Takes one minute", "Your 8 AM plans keep coming"], "Update my card: {link_url}") },
  "PAY-05|Push": { t: "Card hiccup. Fix it in a minute", b: "Update your card so tomorrow's 8 AM plan still lands." },
  "PAY-09|Email": { t: "Cancelled. Access stays till {end_date}", b: em("Done, no hard feelings.", ["Full access until {end_date}", "Your history stays saved"], "Tell us what didn't work (just reply)") },
  "PAY-07|Email": { t: "Your access ended. Your history didn't", b: em("Your leads and notes are saved.", ["Restart any time", "Pick up exactly where you left off"], "Restart: {link_url}") },
  "PAY-11|Email": { t: "Renews in 3 days. Here's your month", b: em("No action needed. Quick look at your month:", ["{calls} calls logged", "{deals} deals moved"], "See my month") },
  "PAY-10|In-app": { t: "Renewed. Next month is ready", b: "Set this month's target in 30 seconds. → Set target" },
  "REF-01|Email": { t: "Know an agent stuck where you were?", b: em("You closed with Khalid. Someone you know is still chasing blue ticks.", ["They get one lead coached free", "You both get {reward}"], "Share my win card") },
  "REF-03|Email": { t: "Your team, same 8 AM plan?", b: em("Two weeks of daily calls. Your team could have the same morning.", ["One plan per agent", "One weekly team view"], "Send the team trial to my manager") },
  "TEAM-01|Email": { t: "Your team this week, in 60 seconds", b: em("Here's your floor at a glance.", ["Calls logged: {team_calls}", "Stuck at Follow-up: {team_stuck}", "Check in with: {agent_name}"], "Open team view") },
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
    const ov = COPY[id + "|" + ch]; if (ov) { if (ov.t) title = typeof ov.t === "function" ? ov.t(streak) : ov.t; if (ov.b) body = ov.b; }
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
    return !sup;
  };
  for (let d = 1; d <= days; d++) {
    const b = beh(d);
    holiday = !!b.holiday; acts = new Set(); chans = new Set(); sent = 0;
    const rel = activated ? d - firstOpen + (opt.shift || 0) : -1;
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
      status = payStatus(opt.pay, opt.shift || 0, 0);
      add(d, "On open", "In-app", "ACC-03", "Welcome, Guru. Let's start with one lead.", "Add the client you keep putting off. Tomorrow 8 AM your coach tells you exactly what to say.", "First open: welcome only now, never before.", "Welcome");
      add(d, "On open", "Email", "ACC-03", "Welcome, Guru. Let's start with one lead.", "Hi Guru,\n\nYou don't need another app that sends reminders. You need someone to tell you what to say when the client goes quiet.\n\nStart small: add one lead today. Tomorrow at 8 AM you'll get who to call first, three steps, and one thing not to say." + SIG, "Welcome email would repeat the in-app welcome.", "Welcome");
      if (opt.pay !== "Not paid (free)" && !opt.pay.startsWith("Trial") && !(opt.shift > 0)) add(d, "On pay", "In-app", "PAY-06", "All your leads are unlocked", "Import your CRM list. Tomorrow's plan covers all of them.", "Paid on day one.", "Milestone");
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
          add(d, b.opened ? "On open" : "11:00 AM", b.opened ? "In-app" : "Push", "PROMO", v[0], b.opened ? v[1] + " → " + v[2] : v[1], lastPromo ? `${prev ? prev.name : lastPromo} not used yesterday, so today: different feature (${pick.name}), angle: ${ag}.` : `First untried feature: ${pick.name}, angle: ${ag}.`, "Feature nudge");
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
      if (add(d, "12:00 PM", "WhatsApp", "WA-OBJ", `"${o[0]}"`, o[1], "WhatsApp role: one objection + the fix to use today.", "Value")) valueSent++;
      const canOffer = /Not paid|Trial|expired|Expired/.test(status);
      const offerOk = canOffer && activeDays >= 3 && valueSent >= (offersSent + 1) * 4 && d - lastOffer >= 3;
      if (offerOk && offersSent < OFFERS.length) { const of = OFFERS[offersSent]; add(d, "7:00 PM", "Email", "OFFER", of[0], of[1] + SIG, `Offer allowed: ${activeDays} active days, ${valueSent} value messages sent first (4:1 rule), status: ${status}.`, "Offer"); offersSent++; lastOffer = d; }
      else if ((d - firstOpen) % 2 === 1) { const v = VALUE[val % VALUE.length]; val++; if (add(d, "6:30 PM", "Email", "VAL", v[1], v[2] + SIG, `Value (${v[0]}) after activation, no pitch.`, "Value")) valueSent++; }
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
