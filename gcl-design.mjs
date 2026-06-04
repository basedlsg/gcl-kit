#!/usr/bin/env node
/**
 * gcl-design.mjs
 * Game Changer Labs — Design System CLI
 *
 * A zero-dependency, offline-ready design system reference extracted from
 * production UI work at Game Changer Labs. Embed these tokens and principles
 * in any project for an instant polished starting point.
 *
 * Usage:
 *   node gcl-design.mjs              → overview (palette, type, spacing, motion)
 *   node gcl-design.mjs tokens       → CSS custom properties ready to paste
 *   node gcl-design.mjs principles   → the 8 design principles
 *   node gcl-design.mjs [cmd] --json → machine-readable JSON output
 *   node gcl-design.mjs --help       → this help text
 */

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM DATA
// All values extracted and genericised from production GCL UI work.
// ─────────────────────────────────────────────────────────────────────────────

const PALETTE = {
  // Base surfaces — cool-white porcelain; stays crisp, never dingy
  background:        { value: "#eaf0fa", label: "Surface base" },
  backgroundDeep:    { value: "#e0e8f5", label: "Surface deep" },
  cardLight:         { value: "#f4f8fe", label: "Card highlight face (raised top-left)" },
  cardShade:         { value: "#e2eaf6", label: "Card shadow face (raised bottom-right)" },
  highlight:         { value: "#ffffff", label: "Crisp white highlight" },
  shadow:            { value: "#c4d3ea", label: "Cool-blue shadow (not grey — keeps soft-UI clean)" },

  // Ink — deep navy scale
  ink:               { value: "#0b1325", label: "Primary text" },
  inkSecondary:      { value: "#242e47", label: "Body text" },
  inkTertiary:       { value: "#3b4763", label: "Supporting text (high contrast)" },
  inkMuted:          { value: "#485473", label: "Muted / metadata" },

  // Accent — confident azure
  accent:            { value: "#2563eb", label: "Primary accent (blue-600; white text ≥5:1)" },
  accentDeep:        { value: "#1b3fa8", label: "Accent deep / hover state" },
  accentSoft:        { value: "#8fb2fb", label: "Accent soft / selection / tint" },
  accentSky:         { value: "#38bdf8", label: "Sky accent for luminous gradients" },
  glow:              { value: "rgba(37,99,235,.34)", label: "Azure glow (box-shadow / radial)" },

  // Semantic status hues — used sparingly (icon tints + faint washes only, never as fills)
  statusSuccess:     { value: "#1aa67a", label: "Success / positive status" },
  statusInfo:        { value: "#2563eb", label: "Info (shares accent)" },
  statusWarning:     { value: "#d9518c", label: "Warning / alert" },
  statusCritical:    { value: "#df6a2b", label: "Critical / danger" },
};

const TYPE_SCALE = {
  // Font families
  familyDisplay: {
    value: '"Cormorant Garamond", Georgia, serif',
    label: "Display / headings",
    note: "Elegant serif — weight 500–600, no italics, tracking -0.02em",
  },
  familyBody: {
    value: '"Hanken Grotesk", system-ui, sans-serif',
    label: "Body / UI",
    note: "Clean grotesque — weight 400/500/600, tracking -0.005em",
  },
  familyVariable: {
    value: '"Fraunces", serif',
    label: "Display variable alternative",
    note: 'Variable axes: "opsz" 72–144, "SOFT" 30. Weight ~480–520.',
  },

  // Fluid size ramp (clamp — min → max)
  sizeHero:    { value: "clamp(3rem, 8.5vw, 6.5rem)",       label: "Hero / splash headline" },
  sizeH1:      { value: "clamp(2.4rem, 5.4vw, 3.8rem)",     label: "Page title (H1)" },
  sizeH2:      { value: "clamp(1.7rem, 3.6vw, 2.4rem)",     label: "Section heading (H2)" },
  sizeH3:      { value: "clamp(1.35rem, 2.6vw, 1.85rem)",   label: "Sub-section heading (H3)" },
  sizeKicker:  { value: "1.35rem",                           label: "Kicker / intro statement" },
  sizeLead:    { value: "clamp(1.06rem, 1.6vw, 1.22rem)",   label: "Lead paragraph" },
  sizeBody:    { value: "clamp(1rem, .96rem + .25vw, 1.12rem)", label: "Body text (root)" },
  sizeSmall:   { value: ".95rem",                            label: "Small / supporting" },
  sizeXSmall:  { value: ".82rem",                            label: "Fine print / metadata" },
  sizeEyebrow: { value: ".76rem",                            label: "Eyebrow label (uppercase)" },

  // Key typographic rules
  lineHeightBody:    { value: "1.62",  label: "Body line-height" },
  lineHeightDisplay: { value: "1.1",   label: "Display line-height" },
  lineHeightTight:   { value: "1.15",  label: "Tight / hero line-height" },
  trackingDisplay:   { value: "-0.02em", label: "Display letter-spacing" },
  trackingBody:      { value: "-0.005em", label: "Body letter-spacing" },
  trackingEyebrow:   { value: "0.22em",  label: "Eyebrow letter-spacing" },
};

const SPACING = {
  // Border-radius scale
  radiusXL:   { value: "34px",   label: "Card / modal corners (XL)" },
  radiusLG:   { value: "26px",   label: "Panel corners (LG)" },
  radiusMD:   { value: "18px",   label: "Component corners (MD)" },
  radiusSM:   { value: "13px",   label: "Icon chip / tag corners (SM)" },
  radiusPill: { value: "999px",  label: "Pills / full-round" },

  // Layout
  maxWidth:   { value: "1120px", label: "Content max-width" },
  viewPadX:   { value: "clamp(1.1rem, 5vw, 2.2rem)",    label: "Horizontal page padding" },
  viewPadTop: { value: "clamp(7rem, 12vh, 9rem)",        label: "Top padding below fixed nav" },

  // Gap / rhythm
  gapXL:      { value: "2.8rem", label: "Major section gap" },
  gapLG:      { value: "2.2rem", label: "Large component gap" },
  gapMD:      { value: "1.4rem", label: "Card grid gap" },
  gapSM:      { value: "0.85rem", label: "Tight list gap" },
};

// Neumorphic shadow sets — light source fixed top-left
// The cool-blue shadow (#c4d3ea) is essential; grey reads dingy on blue-white.
const SHADOWS = {
  neuRaise:   {
    value: "18px 18px 38px #c4d3ea, -16px -16px 36px #ffffff",
    label: "Raised card (standard)",
  },
  neuRaiseLG: {
    value: "26px 26px 56px #c4d3ea, -22px -22px 50px #ffffff",
    label: "Raised card (large / hero)",
  },
  neuRaiseSM: {
    value: "7px 7px 16px #c4d3ea, -7px -7px 16px #ffffff",
    label: "Raised element (small — button, chip)",
  },
  neuInset:   {
    value: "inset 7px 7px 15px #c4d3ea, inset -7px -7px 15px #ffffff",
    label: "Inset / recessed (input, well)",
  },
  neuPress:   {
    value: "inset 5px 5px 12px #c4d3ea, inset -5px -5px 12px #ffffff",
    label: "Pressed / selected state",
  },
  btnPrimary: {
    value: "8px 8px 18px rgba(20,45,120,.30), -6px -6px 14px #ffffff, inset 1px 1px 1px rgba(255,255,255,.4)",
    label: "Primary CTA button resting",
  },
  btnPrimaryHover: {
    value: "12px 12px 30px rgba(20,45,120,.36), -8px -8px 18px #ffffff, inset 1px 1px 1px rgba(255,255,255,.45)",
    label: "Primary CTA button hover",
  },
};

const MOTION = {
  ease: {
    value: "cubic-bezier(.22,.61,.36,1)",
    label: "Primary easing — confident deceleration",
  },
  durationFast:   { value: "180ms", label: "Micro-interactions (transform, color)" },
  durationStd:    { value: "250ms–300ms", label: "UI transitions (shadows, opacity)" },
  durationSlow:   { value: "400ms", label: "Layout shifts, panel reveals" },
  durationAtmo:   { value: "3.8s–4.6s", label: "Ambient breath / pulse loops" },
  scrollReveal:   { value: "GSAP ScrollTrigger, fade+translateY(24px)", label: "Scroll reveal pattern" },
  hoverLift:      { value: "translateY(-2px)", label: "Card hover lift" },
  hoverSlide:     { value: "translateX(3px)", label: "List item hover nudge" },
  activePress:    { value: "translateY(0) + neu-press shadow", label: "Active / click press" },
  focusRing:      { value: "3px solid #2563eb, offset 3px, radius inherit", label: "Keyboard focus ring" },
  reducedMotion:  { value: "prefers-reduced-motion: reduce → all transitions 0.01ms", label: "Accessibility: always implement" },
};

const COMPONENT_PATTERNS = {
  neuCard: {
    label: "Neumorphic Card",
    css: "background: linear-gradient(145deg, #f4f8fe, #e2eaf6); border-radius: 34px; box-shadow: 18px 18px 38px #c4d3ea, -16px -16px 36px #ffffff; border: 1px solid rgba(255,255,255,.5);",
  },
  neuInset: {
    label: "Inset / Input Well",
    css: "background: linear-gradient(145deg, #e2eaf6, #f4f8fe); border-radius: 26px; box-shadow: inset 7px 7px 15px #c4d3ea, inset -7px -7px 15px #ffffff;",
  },
  btnPrimary: {
    label: "Primary Button",
    css: "background: linear-gradient(145deg, #3b82f6 0%, #2563eb 55%, #1d4ed8 100%); color: #fff; font-weight: 600; padding: .92em 1.6em; border-radius: 999px; box-shadow: 8px 8px 18px rgba(20,45,120,.30), -6px -6px 14px #ffffff, inset 1px 1px 1px rgba(255,255,255,.4);",
  },
  eyebrow: {
    label: "Eyebrow Label",
    css: "font-size: .76rem; font-weight: 600; text-transform: uppercase; letter-spacing: .22em; color: #1b3fa8; display: inline-flex; align-items: center; gap: .6em;",
  },
  atmosphere: {
    label: "Background Atmosphere",
    css: "background: radial-gradient(110% 80% at 50% -8%, #ffffff 0%, rgba(255,255,255,0) 56%), radial-gradient(80% 70% at 88% 6%, rgba(56,189,248,.12) 0%, rgba(56,189,248,0) 52%), linear-gradient(180deg, #eef4fc 0%, #e8eff9 58%, #e3ebf7 100%); — plus subtle SVG grain at opacity 0.018, mix-blend-mode soft-light",
  },
};

const PRINCIPLES = [
  {
    name: "Soft-UI with a fixed light source",
    detail: "All neumorphic shadows assume light comes from the top-left. The shadow is cool blue (#c4d3ea), not grey — this is what stops the effect from reading dingy. Raised elements use outer shadows; recessed elements (inputs, wells) use inset shadows. Never mix the two on the same element.",
  },
  {
    name: "No italics — emphasis through colour and weight",
    detail: "Italics kill legibility on screen, especially in serif faces. Instead: use colour (accent-deep) for inline emphasis, 600 weight for strong importance, and display typefaces for hierarchy. The rule is absolute: `em { font-style: normal; color: var(--accent-deep); font-weight: 500; }`.",
  },
  {
    name: "Two typefaces, one job each",
    detail: "A high-contrast serif (display) handles all headlines — never body copy. A geometric grotesque (body) handles all UI text — never headlines. The contrast between them creates rhythm. A third variable serif can substitute for the display face when optical-size axes are needed.",
  },
  {
    name: "Fluid typography with clamp()",
    detail: "Type sizes use CSS clamp() so they scale proportionally between viewport breakpoints — never jump. The formula: clamp(min-rem, preferred-vw, max-rem). Body text sits at clamp(1rem, .96rem + .25vw, 1.12rem); hero text at clamp(3rem, 8.5vw, 6.5rem). Line-heights are 1.6–1.62 for reading, 1.1–1.15 for display.",
  },
  {
    name: "Cool-white porcelain — never warm white, never pure white",
    detail: "The background (#eaf0fa) sits in the cool-blue register. Pure white (#fff) is reserved only for the sharpest highlight points on raised surfaces. Warm whites and greys make the soft-UI shadows look muddy. Keep the whole palette in the same cool hue family.",
  },
  {
    name: "Motion that decelerates — never linear",
    detail: "The primary easing is cubic-bezier(.22,.61,.36,1): fast start, confident deceleration. This matches physical intuition (objects slow as they land). Micro-interactions are 180–250ms. Ambient atmosphere loops run 3.8–4.6s with ease-in-out. Always implement prefers-reduced-motion: collapse all transitions to ~0ms.",
  },
  {
    name: "Three shadow depths, used structurally",
    detail: "Large (neu-raise-lg): hero cards and result medallions. Standard (neu-raise): content cards. Small (neu-raise-sm): buttons, chips, icon blocks. Hover lifts the element and deepens shadows — not a colour change. The pressed/active state inverts to inset shadows, giving physical feedback without an outline.",
  },
  {
    name: "Semantic hues are accents, not fills",
    detail: "Status colours (success green, warning pink, critical orange) appear only as icon tints and faint background washes — never as full card fills. This preserves the cool-blue palette coherence and keeps status signals from screaming. The azure accent does all the heavy interactive lifting.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const ATTRIBUTION = `\n— Built by Game Changer Labs · https://gamechangerlabs.io\n  Want this designed and shipped for real? That's what we do.\n`;

// ANSI colour helpers (gracefully disabled if not a TTY)
const isTTY = process.stdout.isTTY;
const c = {
  reset:  isTTY ? "\x1b[0m"  : "",
  bold:   isTTY ? "\x1b[1m"  : "",
  dim:    isTTY ? "\x1b[2m"  : "",
  blue:   isTTY ? "\x1b[34m" : "",
  cyan:   isTTY ? "\x1b[36m" : "",
  white:  isTTY ? "\x1b[97m" : "",
  yellow: isTTY ? "\x1b[33m" : "",
  green:  isTTY ? "\x1b[32m" : "",
};

function hr(char = "─", len = 60) {
  return c.dim + char.repeat(len) + c.reset;
}

function sectionHeader(title) {
  return `\n${hr()}\n${c.bold}${c.cyan}  ${title}${c.reset}\n${hr()}\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMANDS
// ─────────────────────────────────────────────────────────────────────────────

function printHelp() {
  console.log(`
${c.bold}${c.white}GCL Design System CLI${c.reset}
${c.dim}Game Changer Labs · https://gamechangerlabs.io${c.reset}

${c.bold}Usage:${c.reset}
  node gcl-design.mjs              Design system overview
  node gcl-design.mjs tokens       CSS custom properties (paste into :root)
  node gcl-design.mjs principles   Core design principles
  node gcl-design.mjs [cmd] --json Machine-readable JSON output

${c.bold}Examples:${c.reset}
  node gcl-design.mjs
  node gcl-design.mjs tokens --json | jq '.palette'
  node gcl-design.mjs principles

${ATTRIBUTION}`);
}

// ── OVERVIEW ─────────────────────────────────────────────────────────────────

function printOverview() {
  const lines = [];

  lines.push(`\n${c.bold}${c.white}GCL Design System${c.reset}  ${c.dim}Cool-azure neumorphic · no italics · fluid type${c.reset}`);

  // Palette
  lines.push(sectionHeader("Palette"));
  const paletteGroups = [
    ["Surfaces",  ["background","backgroundDeep","cardLight","cardShade","highlight","shadow"]],
    ["Ink",       ["ink","inkSecondary","inkTertiary","inkMuted"]],
    ["Accent",    ["accent","accentDeep","accentSoft","accentSky","glow"]],
    ["Status",    ["statusSuccess","statusInfo","statusWarning","statusCritical"]],
  ];
  for (const [groupName, keys] of paletteGroups) {
    lines.push(`  ${c.bold}${groupName}${c.reset}`);
    for (const key of keys) {
      const t = PALETTE[key];
      lines.push(`    ${c.cyan}${t.value.padEnd(28)}${c.reset}  ${c.dim}${t.label}${c.reset}`);
    }
    lines.push("");
  }

  // Type scale
  lines.push(sectionHeader("Typography"));
  lines.push(`  ${c.bold}Families${c.reset}`);
  for (const key of ["familyDisplay","familyBody","familyVariable"]) {
    const t = TYPE_SCALE[key];
    lines.push(`    ${c.cyan}${t.label.padEnd(28)}${c.reset}  ${c.dim}${t.value}${c.reset}`);
    if (t.note) lines.push(`    ${" ".repeat(28)}  ${c.dim}↳ ${t.note}${c.reset}`);
  }
  lines.push(`\n  ${c.bold}Size Ramp${c.reset}`);
  for (const key of ["sizeHero","sizeH1","sizeH2","sizeH3","sizeKicker","sizeLead","sizeBody","sizeSmall","sizeXSmall","sizeEyebrow"]) {
    const t = TYPE_SCALE[key];
    lines.push(`    ${c.cyan}${t.label.padEnd(28)}${c.reset}  ${c.dim}${t.value}${c.reset}`);
  }
  lines.push(`\n  ${c.bold}Rhythm${c.reset}`);
  for (const key of ["lineHeightBody","lineHeightDisplay","lineHeightTight","trackingDisplay","trackingBody","trackingEyebrow"]) {
    const t = TYPE_SCALE[key];
    lines.push(`    ${c.cyan}${t.label.padEnd(28)}${c.reset}  ${c.dim}${t.value}${c.reset}`);
  }

  // Spacing
  lines.push(sectionHeader("Spacing & Geometry"));
  lines.push(`  ${c.bold}Border Radius${c.reset}`);
  for (const key of ["radiusXL","radiusLG","radiusMD","radiusSM","radiusPill"]) {
    const t = SPACING[key];
    lines.push(`    ${c.cyan}${t.label.padEnd(28)}${c.reset}  ${c.dim}${t.value}${c.reset}`);
  }
  lines.push(`\n  ${c.bold}Layout${c.reset}`);
  for (const key of ["maxWidth","viewPadX","viewPadTop"]) {
    const t = SPACING[key];
    lines.push(`    ${c.cyan}${t.label.padEnd(28)}${c.reset}  ${c.dim}${t.value}${c.reset}`);
  }
  lines.push(`\n  ${c.bold}Gap / Rhythm${c.reset}`);
  for (const key of ["gapXL","gapLG","gapMD","gapSM"]) {
    const t = SPACING[key];
    lines.push(`    ${c.cyan}${t.label.padEnd(28)}${c.reset}  ${c.dim}${t.value}${c.reset}`);
  }

  // Shadows
  lines.push(sectionHeader("Neumorphic Shadows"));
  lines.push(`  ${c.dim}Light source: top-left. Shadow: cool blue (#c4d3ea). Highlight: white (#ffffff).${c.reset}`);
  lines.push(`  ${c.dim}Never use grey shadows — they read dingy on a cool-white palette.\n${c.reset}`);
  for (const [key, s] of Object.entries(SHADOWS)) {
    lines.push(`  ${c.bold}${s.label}${c.reset}`);
    lines.push(`    ${c.dim}${s.value}${c.reset}\n`);
  }

  // Motion
  lines.push(sectionHeader("Motion"));
  for (const [key, m] of Object.entries(MOTION)) {
    lines.push(`  ${c.cyan}${m.label.padEnd(36)}${c.reset}  ${c.dim}${m.value}${c.reset}`);
  }

  lines.push(ATTRIBUTION);
  console.log(lines.join("\n"));
}

// ── TOKENS ───────────────────────────────────────────────────────────────────

function printTokens() {
  const lines = [];
  lines.push(`/* ═══════════════════════════════════════════════════════════`);
  lines.push(`   GCL Design System — CSS Custom Properties`);
  lines.push(`   Cool-azure neumorphic  |  gamechangerlabs.io`);
  lines.push(`   Paste inside :root { … } or import as a design tokens file.`);
  lines.push(`═══════════════════════════════════════════════════════════ */`);
  lines.push(``);
  lines.push(`:root {`);

  // Palette
  lines.push(`\n  /* ── Palette ── */`);
  lines.push(`  /* Surfaces */`);
  lines.push(`  --color-bg:            #eaf0fa;   /* cool-porcelain base */`);
  lines.push(`  --color-bg-deep:       #e0e8f5;`);
  lines.push(`  --color-card-a:        #f4f8fe;   /* highlight face — raised top-left */`);
  lines.push(`  --color-card-b:        #e2eaf6;   /* shade face — raised bottom-right */`);
  lines.push(`  --color-hi:            #ffffff;   /* crisp white highlight */`);
  lines.push(`  --color-sh:            #c4d3ea;   /* cool-blue shadow — NOT grey */`);
  lines.push(`\n  /* Ink */`);
  lines.push(`  --color-ink:           #0b1325;`);
  lines.push(`  --color-ink-2:         #242e47;`);
  lines.push(`  --color-ink-3:         #3b4763;`);
  lines.push(`  --color-ink-4:         #485473;`);
  lines.push(`\n  /* Accent — azure */`);
  lines.push(`  --color-accent:        #2563eb;   /* blue-600; white text ≥5:1 contrast */`);
  lines.push(`  --color-accent-deep:   #1b3fa8;`);
  lines.push(`  --color-accent-soft:   #8fb2fb;`);
  lines.push(`  --color-accent-sky:    #38bdf8;   /* luminous gradients */`);
  lines.push(`  --color-glow:          rgba(37,99,235,.34);`);
  lines.push(`\n  /* Semantic status — icon tints only, never solid fills */`);
  lines.push(`  --color-success:       #1aa67a;`);
  lines.push(`  --color-info:          #2563eb;`);
  lines.push(`  --color-warning:       #d9518c;`);
  lines.push(`  --color-critical:      #df6a2b;`);

  // Border radius
  lines.push(`\n  /* ── Shape ── */`);
  lines.push(`  --r-xl:   34px;   /* card / modal */`);
  lines.push(`  --r-lg:   26px;   /* panel */`);
  lines.push(`  --r-md:   18px;   /* component */`);
  lines.push(`  --r-sm:   13px;   /* chip / tag */`);
  lines.push(`  --pill:   999px;  /* full-round */`);

  // Shadows
  lines.push(`\n  /* ── Neumorphic Shadows (light source: top-left) ── */`);
  lines.push(`  --neu-raise:    18px 18px 38px var(--color-sh), -16px -16px 36px var(--color-hi);`);
  lines.push(`  --neu-raise-lg: 26px 26px 56px var(--color-sh), -22px -22px 50px var(--color-hi);`);
  lines.push(`  --neu-raise-sm: 7px 7px 16px var(--color-sh), -7px -7px 16px var(--color-hi);`);
  lines.push(`  --neu-inset:    inset 7px 7px 15px var(--color-sh), inset -7px -7px 15px var(--color-hi);`);
  lines.push(`  --neu-press:    inset 5px 5px 12px var(--color-sh), inset -5px -5px 12px var(--color-hi);`);

  // Layout
  lines.push(`\n  /* ── Layout ── */`);
  lines.push(`  --maxw:         1120px;`);
  lines.push(`  --pad-x:        clamp(1.1rem, 5vw, 2.2rem);`);
  lines.push(`  --pad-top:      clamp(7rem, 12vh, 9rem);`);

  // Motion
  lines.push(`\n  /* ── Motion ── */`);
  lines.push(`  --ease: cubic-bezier(.22,.61,.36,1);  /* fast start, confident deceleration */`);

  lines.push(`}`);

  lines.push(`\n/* ── Font Stacks ─────────────────────────────────────────── */`);
  lines.push(`/* Display: Cormorant Garamond (Google Fonts) or Fraunces (variable) */`);
  lines.push(`/* Body:    Hanken Grotesk (Google Fonts)                            */`);
  lines.push(`/*`);
  lines.push(`   @import url('https://fonts.googleapis.com/css2?`);
  lines.push(`     family=Cormorant+Garamond:wght@500;600&`);
  lines.push(`     family=Hanken+Grotesk:wght@400;500;600&`);
  lines.push(`     display=swap');`);
  lines.push(`*/`);

  lines.push(`\n/* ── Neumorphic Card Utility ─────────────────────────────── */`);
  lines.push(`.neu-card {`);
  lines.push(`  background: linear-gradient(145deg, var(--color-card-a), var(--color-card-b));`);
  lines.push(`  border-radius: var(--r-xl);`);
  lines.push(`  box-shadow: var(--neu-raise);`);
  lines.push(`  border: 1px solid rgba(255,255,255,.5);`);
  lines.push(`}`);
  lines.push(`.neu-inset {`);
  lines.push(`  background: linear-gradient(145deg, var(--color-card-b), var(--color-card-a));`);
  lines.push(`  border-radius: var(--r-lg);`);
  lines.push(`  box-shadow: var(--neu-inset);`);
  lines.push(`}`);

  lines.push(`\n/* ── Reduced Motion (always implement) ──────────────────── */`);
  lines.push(`@media (prefers-reduced-motion: reduce) {`);
  lines.push(`  * { animation: none !important; transition-duration: .01ms !important; }`);
  lines.push(`  html { scroll-behavior: auto; }`);
  lines.push(`}`);

  lines.push(`\n/*\n${ATTRIBUTION.trimStart()}*/`);
  console.log(lines.join("\n"));
}

// ── PRINCIPLES ───────────────────────────────────────────────────────────────

function printPrinciples() {
  const lines = [];
  lines.push(`\n${c.bold}${c.white}GCL Design Principles${c.reset}  ${c.dim}What makes the UI feel great${c.reset}\n`);

  PRINCIPLES.forEach((p, i) => {
    const num = String(i + 1).padStart(2, "0");
    lines.push(`${c.bold}${c.cyan}${num}.${c.reset} ${c.bold}${c.white}${p.name}${c.reset}`);
    // Wrap detail to ~70 chars
    const words = p.detail.split(" ");
    let line = "    ";
    for (const w of words) {
      if (line.length + w.length > 74) {
        lines.push(c.dim + line + c.reset);
        line = "    " + w + " ";
      } else {
        line += w + " ";
      }
    }
    if (line.trim()) lines.push(c.dim + line + c.reset);
    lines.push("");
  });

  lines.push(ATTRIBUTION);
  console.log(lines.join("\n"));
}

// ── JSON OUTPUT ──────────────────────────────────────────────────────────────

function printJSON(command) {
  const out = {
    version: "1.0.0",
    source: "Game Changer Labs Design System — https://gamechangerlabs.io",
    command,
    palette: PALETTE,
    typography: TYPE_SCALE,
    spacing: SPACING,
    shadows: SHADOWS,
    motion: MOTION,
    componentPatterns: COMPONENT_PATTERNS,
    principles: PRINCIPLES,
  };

  // Trim output to just the relevant section when a specific command was given
  if (command === "tokens") {
    const tokens = { palette: PALETTE, spacing: SPACING, shadows: SHADOWS, motion: MOTION };
    console.log(JSON.stringify({ ...out, ...tokens }, null, 2));
  } else if (command === "principles") {
    console.log(JSON.stringify({ source: out.source, principles: PRINCIPLES }, null, 2));
  } else {
    console.log(JSON.stringify(out, null, 2));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const jsonMode = args.includes("--json");
const helpMode = args.includes("--help") || args.includes("-h");

// Determine subcommand (first non-flag arg)
const command = args.find(a => !a.startsWith("--") && !a.startsWith("-")) ?? "overview";

if (helpMode) {
  printHelp();
} else if (jsonMode) {
  printJSON(command);
} else {
  switch (command) {
    case "tokens":
      printTokens();
      break;
    case "principles":
      printPrinciples();
      break;
    case "overview":
    default:
      printOverview();
      break;
  }
}
