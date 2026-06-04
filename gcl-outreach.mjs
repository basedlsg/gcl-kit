#!/usr/bin/env node
/**
 * gcl-outreach.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Game Changer Labs — Cold Outreach Playbook CLI
 *
 * Standalone Node ESM. Zero npm dependencies. Zero network calls. Works offline.
 * Run via:  node gcl-outreach.mjs [command] [--json] [--help]
 *
 * Commands:
 *   (no args)   Playbook overview: sequence structure + core principles
 *   sequence    Full multi-touch email sequence with {{placeholders}}
 *   templates   Individual message templates (first touch, follow-ups, break-up)
 *   --json      Output structured JSON (works with every command)
 *   --help      Usage guide
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * METHODOLOGY SOURCE
 * Distilled from a production outreach pipeline running 300+ sends/month.
 * All identifying details have been removed. Every name, company, domain,
 * sender address, and data point is a generic placeholder or invented example.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── SEQUENCE STRUCTURE ──────────────────────────────────────────────────────
// The core cadence: 4 touches, stopped immediately on any positive signal.
// Timing derived from real send-history analysis (day 3 / 7 / 14 follow-ups
// produced the highest reply-to-send ratio across campaigns).

const SEQUENCE = {
  name: "4-Touch Trigger-Personalized Cold Sequence",
  description:
    "A signal-led, low-volume-per-sender sequence. Every touch references a " +
    "real public trigger. All future touches stop the moment a reply, " +
    "bounce, or opt-out is detected.",
  touches: [
    {
      step: 1,
      name: "First Touch",
      channel: "email",
      send_day: 0,
      subject_line: "{{triggerHook}} — quick note",
      goal: "Earn a reply or a click. Do not pitch the full service.",
      length: "4–6 sentences. One ask. No attachments.",
      tone: "Peer-to-peer, curious, non-salesy.",
    },
    {
      step: 2,
      name: "Follow-up 1 — Value Add",
      channel: "email",
      send_day: 3,
      subject_line: "Re: {{triggerHook}}",
      goal: "Add one concrete piece of value (a data point, a short observation). Re-state the ask.",
      length: "3–4 sentences.",
      tone: "Still light. Reference the original email naturally.",
    },
    {
      step: 3,
      name: "Follow-up 2 — Reframe",
      channel: "email",
      send_day: 7,
      subject_line: "Different angle — {{painPoint}}",
      goal: "Reframe around the recipient's pain, not your offering.",
      length: "3–5 sentences.",
      tone: "Slightly more direct. Not aggressive.",
    },
    {
      step: 4,
      name: "Break-up / Last Touch",
      channel: "email",
      send_day: 14,
      subject_line: "Closing the loop",
      goal: "Give the recipient an easy out. Leave the door open without pressure.",
      length: "2–3 sentences.",
      tone: "Warm, human. No hard sell.",
    },
  ],
  stop_rules: [
    "Stop all future touches immediately on any reply (positive or negative).",
    "Stop on a hard or soft bounce — suppress the address permanently.",
    "Stop on any opt-out signal ('unsubscribe', 'no thanks', 'remove me').",
    "Never re-contact a suppressed address within the same campaign.",
  ],
  sender_hygiene: [
    "Cap sends per sender account to 30–60/day to protect deliverability.",
    "Cap sends to any single recipient domain to 3/day per sender.",
    "Space individual sends ≥ 45 seconds apart to mimic human pacing.",
    "Rotate across 2+ authenticated sender accounts once volume exceeds one inbox's safe cap.",
    "Allocate ~35% of daily send capacity to follow-ups; the rest to first touches.",
  ],
};

// ─── CORE PRINCIPLES ─────────────────────────────────────────────────────────
// Distilled from campaign analysis: what separates campaigns with 3–8% reply
// rates from those stuck at <1%.

const PRINCIPLES = [
  {
    id: "trigger_first",
    title: "Trigger before everything",
    detail:
      "Every outreach must start from a real, recent, public signal: a job post, " +
      "a product launch, a funding announcement, a conference talk, a regulatory filing. " +
      "Generic 'I came across your company' openers produce near-zero replies. " +
      "Name the trigger in the subject line or first sentence.",
  },
  {
    id: "verified_only",
    title: "Send only to verified emails",
    detail:
      "Never send to a guessed email pattern (firstname@company.com). " +
      "Use a verification tool (Apollo, Hunter, NeverBounce) before queuing any address. " +
      "Catch-all domains carry significant bounce risk — treat them as unverified. " +
      "A verified list of 30 beats an unverified list of 300.",
  },
  {
    id: "one_decision_maker",
    title: "One real decision-maker per company",
    detail:
      "Identify 2–4 likely decision-makers per company (VP Eng, Head of Ops, CTO, etc.). " +
      "Validate each on LinkedIn before adding to the queue. " +
      "Deduplicate by person, not by company — the same company can appear again " +
      "only when a genuinely different contact is targeted.",
  },
  {
    id: "short_first_ask",
    title: "Small first ask, not a full pitch",
    detail:
      "The goal of touch 1 is a reply, not a sale. " +
      "Offer something concrete and small: a one-paragraph implementation note, " +
      "a specific observation about their trigger, a question worth answering. " +
      "Never ask for a 30-minute call in the first email.",
  },
  {
    id: "name_the_process",
    title: "Name the operational process, not the technology",
    detail:
      "Avoid vague AI/automation language. Instead of 'AI solutions', " +
      "say 'the support ticket routing you're scaling post-launch' or " +
      "'the manual data reconciliation your ops team runs each month'. " +
      "Operational specificity is the single biggest lever on reply rate.",
  },
  {
    id: "source_quality_matters",
    title: "Lead source quality drives reply rate",
    detail:
      "Leads sourced from industry news and trade publications outperform " +
      "generic directory or scraped leads by 3–8x on reply rate. " +
      "Prefer triggers that are time-bound (a recent announcement, a new hire post) " +
      "over evergreen signals.",
  },
  {
    id: "opt_out_every_email",
    title: "Include a simple opt-out in every email",
    detail:
      "Every commercial outreach email must include an easy opt-out line. " +
      "A plain-text 'Reply \"no\" and I won't follow up' is sufficient for low-volume " +
      "manual-style outreach. Add a postal address before scaling to bulk sending.",
  },
];

// ─── MESSAGE TEMPLATES ───────────────────────────────────────────────────────
// Ready-to-use skeleton templates. Fill every {{placeholder}} before sending.
// Subject lines are intentionally short — 5 words or fewer outperform longer ones.

const TEMPLATES = [
  {
    id: "first_touch",
    name: "First Touch — Trigger-Led",
    subject: "{{triggerHook}} — quick note",
    body: `Hi {{firstName}},

Saw that {{company}} {{triggerDescription}} — {{briefObservation}}.

We've helped teams like yours {{specificOutcome}} without {{mainFriction}}.

Worth a quick note: {{oneConcreteValue}}.

Happy to send a short implementation sketch if that's useful. Would that be worth 5 minutes?

{{senderFirstName}}

---
If this isn't relevant, reply "no" and I won't follow up.`,
    placeholders: {
      firstName: "Recipient's first name",
      company: "Recipient's company name",
      triggerHook: "3–5 word summary of the trigger (e.g. 'new AI ops hire')",
      triggerDescription:
        "What happened — drawn from a public source (e.g. 'just posted a Head of AI Ops role')",
      briefObservation: "One-sentence observation that shows you read the signal",
      specificOutcome:
        "Concrete result you've delivered (e.g. 'cut annotation review cycles from 3 days to 4 hours')",
      mainFriction: "The pain they're likely experiencing (e.g. 'adding headcount')",
      oneConcreteValue:
        "One specific thing you can offer right now (e.g. 'a workflow sketch for their annotation pipeline')",
      senderFirstName: "Your first name",
    },
    notes:
      "Keep to 4–6 sentences. One ask. No attachments. No pitch deck in the first email.",
  },
  {
    id: "followup_1",
    name: "Follow-up 1 (Day 3) — Value Add",
    subject: "Re: {{triggerHook}}",
    body: `Hi {{firstName}},

Following up on my note from a few days ago.

One thing that might be relevant: {{dataPointOrObservation}}.

Still happy to put together a short sketch if useful — takes me about 20 minutes once I know your stack.

{{senderFirstName}}`,
    placeholders: {
      firstName: "Recipient's first name",
      triggerHook: "Same hook as first touch subject (creates threaded context)",
      dataPointOrObservation:
        "A specific, public data point or observation about their space (not about you)",
      senderFirstName: "Your first name",
    },
    notes:
      "3–4 sentences. Add value, don't just nudge. Reference the original email so it reads as a thread.",
  },
  {
    id: "followup_2",
    name: "Follow-up 2 (Day 7) — Reframe on Pain",
    subject: "Different angle — {{painPoint}}",
    body: `Hi {{firstName}},

Trying one more angle: most {{roleType}} teams we talk to say {{commonPain}} is the thing that slows them down most.

If that's true for you too, it might be worth a 5-minute chat — even just to hear what's worked elsewhere.

If the timing's off, totally understand.

{{senderFirstName}}`,
    placeholders: {
      firstName: "Recipient's first name",
      painPoint:
        "3–4 word description of their likely pain (e.g. 'manual review backlog')",
      roleType: "Recipient's team type (e.g. 'data ops', 'support engineering')",
      commonPain:
        "The most common pain in that role — stated as something they'd recognize (not your pitch)",
      senderFirstName: "Your first name",
    },
    notes:
      "Reframe around them, not you. Slightly more direct but not aggressive. No bullet lists.",
  },
  {
    id: "breakup",
    name: "Break-up / Last Touch (Day 14)",
    subject: "Closing the loop",
    body: `Hi {{firstName}},

Last note from me — I don't want to crowd your inbox.

If {{specificUseCase}} ever becomes a priority, I'm easy to find: {{senderEmail}}.

Good luck with {{companyOrInitiative}}.

{{senderFirstName}}`,
    placeholders: {
      firstName: "Recipient's first name",
      specificUseCase:
        "The use case you've been pitching (e.g. 'scaling your annotation pipeline')",
      senderEmail: "Your professional email address",
      companyOrInitiative:
        "Something specific to their company/role (shows you paid attention)",
      senderFirstName: "Your first name",
    },
    notes:
      "2–3 sentences. Warm and human. No hard sell. Leaves the door open without pressure.",
  },
  {
    id: "linkedin_connection",
    name: "LinkedIn Connection Note (Optional Channel)",
    subject: "(LinkedIn connection request note — 300 char max)",
    body: `{{firstName}}, saw the {{triggerHook}} — {{oneSentenceObservation}}. Would love to connect.`,
    placeholders: {
      firstName: "Recipient's first name",
      triggerHook: "Brief trigger reference",
      oneSentenceObservation: "Why you're reaching out — one sentence, specific to them",
    },
    notes:
      "Use LinkedIn as a warm-up or parallel touch, not a replacement for email. " +
      "Do not pitch in the connection note itself.",
  },
];

// ─── LEAD SOURCING FRAMEWORK ─────────────────────────────────────────────────
// How to find leads worth contacting. Ordered by signal quality.

const LEAD_SOURCING = {
  signal_types: [
    {
      rank: 1,
      type: "Hiring signals",
      description:
        "Job posts for roles that imply a workflow gap (e.g. Head of AI Ops, " +
        "RevOps Lead, Annotation Manager). The post tells you the pain and the timeline.",
      discovery_method: "LinkedIn Jobs, job boards, company careers pages",
    },
    {
      rank: 2,
      type: "Product / funding announcements",
      description:
        "New product launches or funding rounds that imply rapid scaling without " +
        "sufficient internal implementation capacity.",
      discovery_method: "TechCrunch, industry trade publications, PR Newswire, company blogs",
    },
    {
      rank: 3,
      type: "Regulatory / compliance events",
      description:
        "New regulations, permit filings, policy changes that create urgent " +
        "operational needs.",
      discovery_method: "Government portals, industry associations, regulatory news feeds",
    },
    {
      rank: 4,
      type: "Conference / speaking signals",
      description:
        "A company rep speaking at a conference on a topic that aligns with your offering — " +
        "signals active thought leadership and decision-making authority.",
      discovery_method: "Conference agendas, event pages, LinkedIn posts",
    },
    {
      rank: 5,
      type: "Team / leadership changes",
      description:
        "New hires or role changes at VP+ level. New leaders often audit tooling " +
        "and vendors in their first 90 days.",
      discovery_method: "LinkedIn, press releases",
    },
  ],
  enrichment_steps: [
    "Identify 60–100 trigger/company candidates from signal sources.",
    "Deduplicate against your existing contact history (by person, not just company).",
    "Identify 2–4 likely decision-makers per company via LinkedIn.",
    "Verify work emails using Apollo, Hunter, or similar — send only to verified addresses.",
    "Keep rows with: trigger, source URL, LinkedIn URL, verified email, target language/region.",
    "Export all partially verified rows for manual validation instead of guessing.",
  ],
  daily_targets: {
    candidate_companies: "60–100 (research stage)",
    decision_makers_per_company: "2–4 (LinkedIn validation required)",
    verified_new_leads_target: "30 per active campaign",
    send_cap_per_sender: "30–60/day (protect deliverability)",
    same_domain_cap: "3/day per sender account",
  },
};

// ─── PERSONALIZATION FRAMEWORK ───────────────────────────────────────────────
// What to research before writing each email.

const PERSONALIZATION = {
  required_fields: [
    "firstName — recipient's actual first name (not 'Hi there')",
    "company — correct legal/brand name",
    "triggerDescription — specific public event that prompted outreach",
    "sourceURL — the public URL where you found the trigger",
    "linkedInURL — validated LinkedIn profile for the recipient",
    "verifiedEmail — email confirmed via a verification tool",
    "language — preferred language if not English (e.g. Mandarin, Spanish)",
  ],
  optional_enrichment: [
    "recentContent — article, talk, or post by the recipient you can reference",
    "teamSize — rough sense of team scale",
    "techStack — relevant tools they use (if public)",
    "recentCompanyMilestone — funding, acquisition, product launch",
  ],
  personalization_depth: {
    minimum: "Trigger + first name + company + one-line observation",
    recommended: "Trigger + named operational process + concrete outcome + specific ask",
    avoid: [
      "Complimenting their website or LinkedIn profile generically",
      "Using 'AI solutions', 'cutting-edge technology', 'digital transformation'",
      "Attaching a deck or case study in the first email",
      "Mentioning competitors by name",
    ],
  },
};

// ─── CAMPAIGN PERFORMANCE BENCHMARKS ─────────────────────────────────────────
// Based on production data. Use these to calibrate expectations and diagnose issues.

const BENCHMARKS = {
  reply_rate: {
    cold_email_industry_average: "1–3%",
    trigger_personalized_target: "3–8%",
    investigate_if_below: "1%",
    note:
      "Reply rate below 1% usually means the trigger is too weak, the email is too long, " +
      "or the recipient list is not the right decision-makers.",
  },
  bounce_rate: {
    acceptable: "<3%",
    warning: "3–8%",
    stop_sending_to_domain_if: ">15% on 5+ sends",
    note:
      "High bounce rates on a specific domain indicate catch-all or outdated email data. " +
      "Suppress the domain and source fresh leads.",
  },
  sequence_completion: {
    most_replies_arrive_at: "Touch 1 or Touch 3",
    touch_4_purpose: "Brand impression + door left open, not expected to convert",
  },
  lead_supply: {
    bottleneck_is_usually: "Verified lead supply, not sender capacity",
    fix: "Invest in better trigger discovery and email verification before adding more sender accounts",
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const FOOTER =
  "\n— Built by Game Changer Labs · https://gamechangerlabs.io\n" +
  "  Want an AI outreach system built for real? That's what we do.\n";

/**
 * hr() — simple horizontal rule for readability
 */
function hr(char = "─", len = 72) {
  return char.repeat(len);
}

/**
 * formatTouch() — pretty-print a single sequence touch
 */
function formatTouch(touch) {
  return [
    `  Touch ${touch.step}: ${touch.name}  (Day ${touch.send_day})`,
    `  Channel : ${touch.channel}`,
    `  Subject : ${touch.subject_line}`,
    `  Goal    : ${touch.goal}`,
    `  Length  : ${touch.length}`,
    `  Tone    : ${touch.tone}`,
  ].join("\n");
}

/**
 * formatTemplate() — pretty-print a single message template
 */
function formatTemplate(tpl) {
  const lines = [
    hr(),
    `TEMPLATE: ${tpl.name.toUpperCase()}`,
    `Subject : ${tpl.subject}`,
    hr("─", 40),
    tpl.body,
    hr("─", 40),
    "PLACEHOLDERS:",
    ...Object.entries(tpl.placeholders).map(([k, v]) => `  {{${k}}}  →  ${v}`),
    "",
    `NOTE: ${tpl.notes}`,
  ];
  return lines.join("\n");
}

// ─── COMMAND HANDLERS ─────────────────────────────────────────────────────────

/**
 * cmdOverview() — no-args default: playbook overview
 */
function cmdOverview(asJson) {
  if (asJson) {
    console.log(
      JSON.stringify(
        {
          tool: "gcl-outreach",
          version: "1.0.0",
          source: "gamechangerlabs.io",
          sequence: SEQUENCE,
          principles: PRINCIPLES,
          benchmarks: BENCHMARKS,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`
${hr("═")}
  GAME CHANGER LABS — COLD OUTREACH PLAYBOOK
  https://gamechangerlabs.io
${hr("═")}

SEQUENCE: ${SEQUENCE.name}
${SEQUENCE.description}

${hr()}
TOUCH-BY-TOUCH BREAKDOWN
${hr()}
${SEQUENCE.touches.map(formatTouch).join("\n\n")}

${hr()}
STOP RULES (applied automatically)
${hr()}
${SEQUENCE.stop_rules.map((r, i) => `  ${i + 1}. ${r}`).join("\n")}

${hr()}
SENDER HYGIENE
${hr()}
${SEQUENCE.sender_hygiene.map((h, i) => `  ${i + 1}. ${h}`).join("\n")}

${hr()}
CORE PRINCIPLES
${hr()}
${PRINCIPLES.map((p, i) => `  ${i + 1}. [${p.id}] ${p.title}\n     ${p.detail}`).join("\n\n")}

${hr()}
PERFORMANCE BENCHMARKS
${hr()}
  Reply rate target  : ${BENCHMARKS.reply_rate.trigger_personalized_target}
  Bounce rate limit  : ${BENCHMARKS.bounce_rate.acceptable}
  Lead supply note   : ${BENCHMARKS.lead_supply.bottleneck_is_usually}

  Run "node gcl-outreach.mjs sequence"  → full sequence with templates
  Run "node gcl-outreach.mjs templates" → individual message templates
  Run any command with --json            → structured JSON for AI agents
`);
  console.log(FOOTER);
}

/**
 * cmdSequence() — full sequence with timing + sourcing framework
 */
function cmdSequence(asJson) {
  if (asJson) {
    console.log(
      JSON.stringify(
        {
          tool: "gcl-outreach",
          command: "sequence",
          sequence: SEQUENCE,
          lead_sourcing: LEAD_SOURCING,
          personalization: PERSONALIZATION,
          templates: TEMPLATES,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`
${hr("═")}
  FULL OUTREACH SEQUENCE — Game Changer Labs Playbook
${hr("═")}

${SEQUENCE.touches.map(formatTouch).join("\n\n")}

${hr()}
STOP RULES
${hr()}
${SEQUENCE.stop_rules.map((r, i) => `  ${i + 1}. ${r}`).join("\n")}

${hr()}
SENDER HYGIENE RULES
${hr()}
${SEQUENCE.sender_hygiene.map((h, i) => `  ${i + 1}. ${h}`).join("\n")}

${hr()}
LEAD SOURCING — Signal Types (ranked by quality)
${hr()}
${LEAD_SOURCING.signal_types
  .map(
    (s) =>
      `  ${s.rank}. ${s.type}\n     ${s.description}\n     Discovery: ${s.discovery_method}`,
  )
  .join("\n\n")}

${hr()}
ENRICHMENT STEPS
${hr()}
${LEAD_SOURCING.enrichment_steps.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}

${hr()}
DAILY TARGETS
${hr()}
${Object.entries(LEAD_SOURCING.daily_targets)
  .map(([k, v]) => `  ${k.replace(/_/g, " ")} : ${v}`)
  .join("\n")}

${hr()}
PERSONALIZATION — REQUIRED FIELDS
${hr()}
${PERSONALIZATION.required_fields.map((f) => `  • ${f}`).join("\n")}

${hr()}
PERSONALIZATION — WHAT TO AVOID
${hr()}
${PERSONALIZATION.personalization_depth.avoid.map((a) => `  ✗ ${a}`).join("\n")}
`);
  console.log(FOOTER);
}

/**
 * cmdTemplates() — individual ready-to-use message templates
 */
function cmdTemplates(asJson) {
  if (asJson) {
    console.log(
      JSON.stringify(
        {
          tool: "gcl-outreach",
          command: "templates",
          templates: TEMPLATES,
          personalization: PERSONALIZATION,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`
${hr("═")}
  MESSAGE TEMPLATES — Game Changer Labs Cold Outreach Playbook
${hr("═")}
Fill every {{placeholder}} with real, researched information before sending.
A lazy fill is worse than no personalization.

${TEMPLATES.map(formatTemplate).join("\n\n")}

${hr()}
PERSONALIZATION MINIMUM BAR
${hr()}
  Required for every send:
${PERSONALIZATION.required_fields.map((f) => `    • ${f}`).join("\n")}
`);
  console.log(FOOTER);
}

/**
 * cmdHelp() — usage guide
 */
function cmdHelp() {
  console.log(`
${hr("═")}
  gcl-outreach — Game Changer Labs Cold Outreach CLI
  https://gamechangerlabs.io
${hr("═")}

USAGE
  node gcl-outreach.mjs [command] [--json]

COMMANDS
  (no args)   Playbook overview: sequence timing + core principles
  sequence    Full multi-touch sequence with lead sourcing + personalization guide
  templates   Individual message templates with {{placeholders}}
  --help      This help text

FLAGS
  --json      Outputs structured JSON instead of human-readable text.
              Designed for AI agents that parse and fill the templates.

EXAMPLES
  node gcl-outreach.mjs
  node gcl-outreach.mjs sequence
  node gcl-outreach.mjs templates
  node gcl-outreach.mjs sequence --json
  node gcl-outreach.mjs templates --json

VIA npx (once published)
  npx gcl-outreach
  npx gcl-outreach sequence --json

ABOUT
  This CLI encodes the outreach methodology used by Game Changer Labs — a
  technology implementation studio that builds AI agents, automation systems,
  and outreach infrastructure for growth-stage companies.

  The methodology is based on production data from multi-campaign cold
  outreach systems. All templates use generic placeholders and contain
  zero proprietary or identifying information.
`);
  console.log(FOOTER);
}

// ─── ENTRY POINT ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const showHelp = args.includes("--help") || args.includes("-h");

const command = args.find((a) => !a.startsWith("--")) ?? "";

if (showHelp) {
  cmdHelp();
} else if (command === "sequence") {
  cmdSequence(asJson);
} else if (command === "templates") {
  cmdTemplates(asJson);
} else if (command === "") {
  cmdOverview(asJson);
} else {
  console.error(`\nUnknown command: "${command}"\nRun with --help for usage.\n`);
  process.exit(1);
}
