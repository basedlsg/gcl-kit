#!/usr/bin/env node

/**
 * Game Changer Labs — Prompt Generator for Premium Website Builds
 *
 * A CLI tool that generates production-grade website design briefs using the
 * "Hero-First Architecture" framework — a systematic approach to writing prompts
 * for AI code generators (v0, Lovable, Cursor, Google AI Studio, Bolt).
 *
 * Zero dependencies. Works offline. Node 18+.
 */

import fs from 'fs';
import path from 'path';

// ============================================================================
// FRAMEWORK DEFINITION
// ============================================================================

const FRAMEWORK = {
  description: `The Hero-First Architecture is a systematic framework for writing prompts that force AI code generators to produce award-winning, Awwwards-level websites.

Core Philosophy:
- Treat AI like a junior designer who needs hyper-specific, code-ready instructions — not vague creative briefs
- Every website begins with the Hero Section. This is the #1 reason AI sites look cheap.
- Never use defaults: specify exact fonts, colors, layout patterns, animation timing

Key Components:
1. Hero Archetype — 6 proven hero patterns (Cinematic Video, Split-Screen, Giant Typography, Product Floating, Bottom-Anchored Editorial, Massive Image-First)
2. Entrance Choreography — Staggered animations that make content feel alive (Blur-Fade-Up, WordsPullUp, BlurText)
3. Design System — Explicit color palette, typography stack, spacing tokens
4. Anti-Slop Rules — Banned patterns that make AI outputs feel generic (no Inter font, no pure black, no centered boring heroes)
5. CSS Effects Library — Copy-paste ready components (Liquid Glass, Bottom Blur Mask, gradient overlays)

Each prompt follows this template:
- Brand name + aesthetic (3 adjectives) + tech stack
- Explicit Hero Archetype selection
- Complete Design System (colors, fonts, spacing)
- Global CSS effects to include
- Hero entrance choreography + timing
- Navbar specification
- Hero section (with exact layout, copy, CTAs)
- Remaining sections (with the same level of specificity)

Why This Works:
- AI generates better output when given explicit constraints, not freedom
- The 6 archetypes cover 95% of website use cases
- Staggered entrance animations hide the "AI feel" — everything appears instantly by default
- Anti-slop rules eliminate generic AI aesthetics (Times New Roman vibes, centered boring layouts)
- Design tokens make the output look polished, not default
`,

  archetypes: {
    'A': {
      name: 'The Cinematic Video Hero',
      description: 'Full-viewport looping video with gradient mask overlay. Content bottom or left-aligned, never centered.',
      bestFor: ['Brand films', 'Agencies', 'Luxury goods', 'Premium services'],
      features: [
        'Full-bleed looping <video> (autoPlay, loop, muted, playsInline)',
        'Gradient mask overlay (NOT flat bg-black/50)',
        'Massive display typography (text-[10vw] or larger)',
        'Bottom or left-aligned content',
        'Reference: "Velorah", "Prisma" luxury brand patterns'
      ]
    },
    'B': {
      name: 'The Split-Screen Hero',
      description: 'Viewport divided into unequal halves (60/40 or 70/30). Text on one side, full-bleed image/video on the other. No overlap.',
      bestFor: ['Products', 'Portfolios', 'Editorial brands', 'Tech companies'],
      features: [
        'CSS Grid split layout (e.g., grid-cols-12, col-span-7 and col-span-5)',
        'Left: text content (headline, subtitle, CTA)',
        'Right: full-bleed image or video (object-cover h-full)',
        'Clean spatial zones — text never overlaps image',
        'Reference: "Jack — 3D Creator" portfolio pattern'
      ]
    },
    'C': {
      name: 'The Giant Typography Hero',
      description: 'The headline IS the visual. No background image needed. Typography fills 80-100% of viewport width.',
      bestFor: ['Fashion', 'Creative studios', 'Bold brands', 'Type-first design'],
      features: [
        'Headline: text-[20vw] or larger with gradient text effect',
        'Each word animates in individually (WordsPullUp component)',
        'Subtitle and CTA sit BELOW the headline, not on top',
        'Motion: y: 20 → 0, staggered by 0.08s per word',
        'Reference: "Grow" hero, "Jack — Hi, i\'m jack" patterns'
      ]
    },
    'D': {
      name: 'The Product Floating Hero',
      description: 'Single product image floating center-frame with generous negative space. Product uses cursor-tracking magnetic effect.',
      bestFor: ['Single product focus', 'E-commerce', 'Luxury items', 'Photography'],
      features: [
        'Dark or neutral background with product floating center',
        'Product uses Magnet component (cursor-tracking magnetic effect)',
        'Text sits ABOVE and BELOW product (two separate zones)',
        'Product fades in with y: 30 entrance, delay: 0.6s (theatrical reveal AFTER text)',
        'Reference: "Jack" portrait with Magnet component'
      ]
    },
    'E': {
      name: 'The Bottom-Anchored Editorial',
      description: 'Content pushed to BOTTOM of viewport. Top 60% is pure unobstructed visual. Background uses bottom-only blur mask.',
      bestFor: ['Wine/luxury hospitality', 'Architecture', 'Editorial', 'Cinematic brands'],
      features: [
        'Full-bleed video or image background with bottom blur mask (NOT dark gradient overlay)',
        'Content at bottom: flex-1 flex-col justify-end, pb-8 md:pb-16',
        'Headline on left, description + CTA on right (12-column grid)',
        'Top 60% of viewport is pure visual — no text overlay',
        'Reference: "Prisma" hero, cinematic streaming patterns'
      ]
    },
    'F': {
      name: 'The Massive Image-First Hero',
      description: 'Hero IS a full-bleed image. Text is minimal and decorative. No overlay needed (use mix-blend-mode instead).',
      bestFor: ['Photography', 'Travel', 'Visual storytelling', 'Nature/lifestyle'],
      features: [
        'Full-bleed image: min-h-[100dvh] object-cover, rounded-b-[32px]',
        'Minimal text overlay using mix-blend-exclusion or mix-blend-difference (no dark overlay needed)',
        'Small floating CTA pill in bottom-right corner',
        'Image carries all the visual weight',
        'Reference: "Orbis.Nft" image-first hero'
      ]
    }
  },

  choreographies: {
    'blur-fade-up': {
      name: 'Blur-Fade-Up System',
      description: 'Every element enters with simultaneous opacity fade, blur reduction, and upward translate. Staggered by element.',
      css: `@keyframes blurFadeUp {
  from { opacity: 0; filter: blur(20px); transform: translateY(40px); }
  to { opacity: 1; filter: blur(0); transform: translateY(0); }
}
.animate-blur-fade-up {
  animation: blurFadeUp 1s ease-out forwards;
  opacity: 0;
}`,
      timing: {
        'Nav logo': '0ms',
        'Nav links': '100ms, 150ms, 200ms',
        'Eyebrow pill': '300ms',
        'Headline': '400ms',
        'Subtitle': '500ms',
        'Primary CTA': '600ms',
        'Secondary CTA': '700ms'
      }
    },
    'words-pull-up': {
      name: 'WordsPullUp System',
      description: 'For Giant Typography heroes. Split headline by words. Each word animates from {y: 20, opacity: 0} to {y: 0, opacity: 1}, staggered by 0.08s per word.',
      implementation: 'Split headline into <motion.span> elements. Use Framer Motion with useInView trigger.',
      timing: 'Stagger: 0.08s per word'
    },
    'blur-text': {
      name: 'BlurText System',
      description: 'Each word animates through 3 keyframe steps: blur(10px) → blur(5px) → blur(0px). Staggered by 200ms per word.',
      timing: '0.35s per step, 200ms stagger between words'
    }
  },

  antiSlop: {
    'Typography': [
      'Ban Inter font — use Instrument Serif, Barlow, Satoshi, Cabinet Grotesk, Fraunces, Outfit, Geist instead',
      'Ban timid hero headlines — text-4xl is forbidden for hero H1. Minimum text-6xl, preferably text-[10vw]',
      'Ban normal line height on headlines — use leading-[0.85] to leading-none for tight, editorial feel',
      'Ban centered body text — left-align everything except hero headlines'
    ],
    'Color': [
      'Ban pure black (#000000) — use Zinc-950, Charcoal, or rich darks like #080B09, #0C0907',
      'Ban pure white text (use warm creams like #E8E0D4, #EDE6DA)',
      'Ban AI purple/neon blue gradients',
      'Ban flat bg-black/50 overlays — use gradient masks that fade to background color'
    ],
    'Layout': [
      'Ban centered heroes when design intent is editorial or luxury — force asymmetric, split-screen, or bottom-anchored',
      'Ban 3-column equal card grids — use asymmetric bento (grid-cols-12 with varying spans), zig-zag, or horizontal scroll',
      'Ban h-screen — always use min-h-[100dvh] (iOS Safari fix)',
      'Ban unsplash texture images as hero backgrounds — they look like blog posts. Use video, product photos, or AI-generated imagery'
    ],
    'Copy': [
      'Ban clichés: "Elevate", "Seamless", "Unleash", "Next-Gen", "Innovative", "Cutting-edge"',
      'Ban fake placeholder names: "John Doe", "Acme Corp", "Nexus", "TechFlow"',
      'Ban fake round numbers (99.99%, 50%) — use organic data (47.2%, 3.8x)',
      'Ban emojis — ever'
    ],
    'Motion': [
      'Ban linear and ease-in-out easing — use spring physics or custom cubic-bezier(0.16, 1, 0.3, 1)',
      'Ban instant appearance — every hero element MUST have staggered blur-fade-up entrance',
      'Ban static content — use scroll-triggered reveals and interactive elements'
    ]
  },

  tokens: {
    colors: [
      { name: 'Background', token: '--color-bg', role: 'Page background (no pure #000000)' },
      { name: 'Foreground', token: '--color-fg', role: 'Primary text (no pure white)' },
      { name: 'Accent', token: '--color-accent', role: 'CTAs, highlights, prices' },
      { name: 'Muted', token: '--color-muted', role: 'Secondary text, borders' }
    ],
    typography: [
      { role: 'display', token: '--text-display', example: 'text-[10vw], line-height 0.85, tracking -0.05em' },
      { role: 'heading', token: '--text-heading', example: 'text-4xl, line-height 1.1' },
      { role: 'body', token: '--text-body', example: 'text-base, line-height 1.6' },
      { role: 'label', token: '--text-label', example: 'text-xs, uppercase, tracking-widest' }
    ]
  },

  cssEffects: {
    'liquid-glass': `/* Frosted glass effect for navigation and UI elements */
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}`,
    'liquid-glass-strong': `/* Stronger frosted glass for primary CTAs */
.liquid-glass-strong {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  border: none;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.05),
    inset 0 1px 1px rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;
}
.liquid-glass-strong::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 20%,
    rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.5) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}`,
    'blur-mask-bottom': `/* Bottom blur mask — replaces dark gradient overlays for bottom-anchored heroes */
.blur-mask-bottom {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  mask-image: linear-gradient(to top, black 0%, transparent 45%);
  -webkit-mask-image: linear-gradient(to top, black 0%, transparent 45%);
  pointer-events: none;
  z-index: 1;
}`
  }
};

// ============================================================================
// PROMPT TEMPLATES FOR EACH TYPE
// ============================================================================

const PROMPT_TEMPLATES = {
  'landing': {
    description: 'High-converting landing page for a SaaS, digital product, or service',
    template: {
      sections: ['Design System', 'Core CSS', 'Hero Entrance Choreography', 'Navbar', 'Hero Section', 'Features/Benefits Section', 'CTA Section', 'Footer'],
      variables: [
        '{{PRODUCT_NAME}}',
        '{{PRODUCT_DESCRIPTION}}',
        '{{AESTHETIC_ADJECTIVES}}',
        '{{HERO_ARCHETYPE}}',
        '{{PRIMARY_COLOR}}',
        '{{ACCENT_COLOR}}',
        '{{HEADLINE_COPY}}',
        '{{SUBHEADLINE_COPY}}',
        '{{PRIMARY_CTA_TEXT}}',
        '{{SECONDARY_CTA_TEXT}}',
        '{{FEATURES_LIST}}',
        '{{SOCIAL_PROOF}}'
      ]
    }
  },
  'product': {
    description: 'Single-product showcase (e.g., a luxury item, software, SaaS tool)',
    template: {
      sections: ['Design System', 'Hero (Product Floating or Split-Screen)', 'Product Details', 'Why Choose Us', 'Specifications', 'Testimonials', 'CTA', 'Footer'],
      variables: [
        '{{PRODUCT_NAME}}',
        '{{PRODUCT_CATEGORY}}',
        '{{UNIQUE_SELLING_POINT}}',
        '{{HERO_ARCHETYPE}}',
        '{{PRODUCT_HERO_IMAGE_BRIEF}}',
        '{{PRICE}}',
        '{{KEY_FEATURES}}',
        '{{TESTIMONIAL_QUOTES}}',
        '{{CALL_TO_ACTION}}'
      ]
    }
  },
  'portfolio': {
    description: 'Creative portfolio or agency showcase (designer, photographer, studio, developer)',
    template: {
      sections: ['Design System', 'Hero (Split-Screen or Giant Typography)', 'Work Showcase', 'About', 'Process', 'Contact CTA', 'Footer'],
      variables: [
        '{{CREATOR_NAME}}',
        '{{DISCIPLINE}}',
        '{{AESTHETIC_ADJECTIVES}}',
        '{{HERO_ARCHETYPE}}',
        '{{TAGLINE}}',
        '{{PROJECT_DESCRIPTIONS}}',
        '{{HERO_IMAGE_BRIEF}}',
        '{{AWARDS_OR_CREDENTIALS}}',
        '{{PROCESS_STEPS}}'
      ]
    }
  },
  'saas': {
    description: 'SaaS product landing page with emphasis on features, pricing, and ROI',
    template: {
      sections: ['Design System', 'Hero (Cinematic or Split-Screen)', 'Problem Statement', 'Solution Overview', 'Key Features (Asymmetric Grid)', 'Pricing Tiers', 'FAQ', 'CTA', 'Footer'],
      variables: [
        '{{PRODUCT_NAME}}',
        '{{TAGLINE}}',
        '{{TARGET_AUDIENCE}}',
        '{{PRIMARY_PROBLEM}}',
        '{{SOLUTION_BRIEF}}',
        '{{HERO_ARCHETYPE}}',
        '{{FEATURES_WITH_ICONS}}',
        '{{PRICING_TIERS}}',
        '{{ANNUAL_SAVINGS_CLAIM}}',
        '{{FAQ_ITEMS}}'
      ]
    }
  },
  'luxury': {
    description: 'Luxury brand site (wine, jewelry, fashion, hospitality, automotive)',
    template: {
      sections: ['Design System (Dark, Rich Colors)', 'Hero (Bottom-Anchored Editorial or Cinematic Video)', 'Heritage Story', 'Craftsmanship Grid', 'Product Showcase', 'Testimonials', 'Appointment/Contact CTA', 'Footer'],
      variables: [
        '{{BRAND_NAME}}',
        '{{BRAND_POSITIONING}}',
        '{{HERO_ARCHETYPE}}',
        '{{BACKGROUND_COLOR}}',
        '{{TEXT_COLOR}}',
        '{{ACCENT_COLOR}}',
        '{{HERITAGE_STORY}}',
        '{{CRAFTSMANSHIP_DETAILS}}',
        '{{PRODUCT_NAMES}}',
        '{{HERO_IMAGE_CINEMATIC_BRIEF}}'
      ]
    }
  },
  'ecommerce': {
    description: 'E-commerce product catalog or multi-product store',
    template: {
      sections: ['Design System', 'Hero (Image-First or Product Floating)', 'Category Grid (Asymmetric)', 'Featured Product', 'Collections/Collections Tiles', 'Testimonials', 'Newsletter Signup', 'Footer'],
      variables: [
        '{{STORE_NAME}}',
        '{{PRODUCT_CATEGORY}}',
        '{{PRODUCT_LIST_WITH_PRICES}}',
        '{{HERO_IMAGE_BRIEF}}',
        '{{UNIQUE_SELLING_POINTS}}',
        '{{SHIPPING_PROMISE}}',
        '{{CUSTOMER_TESTIMONIALS}}',
        '{{COLLECTION_THEMES}}'
      ]
    }
  }
};

// ============================================================================
// FULL PROMPT TEMPLATE (Generic, Fill-in-the-blank)
// ============================================================================

const FULL_PROMPT_TEMPLATE = `Build a single-page landing site for {{BRAND_NAME}}.
The aesthetic is {{AESTHETIC_ADJECTIVES}}.
Stack: React + Vite + Tailwind CSS + Framer Motion + Lucide React.

**Hero Archetype**: {{HERO_ARCHETYPE}} (from the 6 proven archetypes)

### 1. DESIGN SYSTEM (DESIGN.MD)

**Theme:** {{THEME_LIGHT_OR_DARK}}
> {{POETIC_VISION_STATEMENT}}

#### Tokens — Colors
*(No pure #000000. No pure white. No AI purple/neon.)*
| Name | Value | Token | Role |
| :--- | :--- | :--- | :--- |
| Background | {{BG_COLOR_HEX}} | \`--color-bg\` | {{BG_ROLE}} |
| Foreground | {{FG_COLOR_HEX}} | \`--color-fg\` | {{FG_ROLE}} |
| Accent | {{ACCENT_COLOR_HEX}} | \`--color-accent\` | {{ACCENT_ROLE}} |
| Muted | {{MUTED_COLOR_HEX}} | \`--color-muted\` | {{MUTED_ROLE}} |

#### Tokens — Typography
*(No Inter. Use Instrument Serif, Barlow, Satoshi, Outfit, Fraunces, Geist, Cabinet Grotesk.)*
| Role | Font | Size | Line Height | Tracking | Token |
| :--- | :--- | :--- | :--- | :--- | :--- |
| display | {{DISPLAY_FONT}} | {{DISPLAY_SIZE}} | {{DISPLAY_LH}} | {{DISPLAY_TRACKING}} | \`--text-display\` |
| body | {{BODY_FONT}} | {{BODY_SIZE}} | {{BODY_LH}} | {{BODY_TRACKING}} | \`--text-body\` |

### 2. CORE CSS
Add this to global CSS:
\`\`\`css
[Include full Liquid Glass CSS from Section 5 of skill.md]
[If using Bottom-Anchored hero, also include Bottom Blur Mask effect]
\`\`\`

### 3. HERO ENTRANCE CHOREOGRAPHY
**System**: {{CHOREOGRAPHY_SYSTEM}} (Blur-Fade-Up, WordsPullUp, or BlurText)
**Timing**:
- {{ELEMENT_1}}: {{DELAY_1}}
- {{ELEMENT_2}}: {{DELAY_2}}
- {{ELEMENT_3}}: {{DELAY_3}}
- {{ELEMENT_4}}: {{DELAY_4}}
- {{ELEMENT_5}}: {{DELAY_5}}

### 4. NAVBAR
**Style**: {{NAVBAR_STYLE}} (Floating Glass Pill, Black Pill Hanging from Top, etc.)
- Container: {{NAVBAR_CONTAINER_CLASSES}}
- Logo: {{LOGO_TEXT}}, {{LOGO_FONT}}, {{LOGO_SIZE}}
- Nav links: {{NAV_LINKS}} (each {{NAV_LINK_CLASSES}})
- CTA: {{CTA_BUTTON_TEXT}}, {{CTA_BUTTON_STYLE}}

### 5. HERO SECTION (min-h-[100dvh])
**Archetype**: {{HERO_ARCHETYPE}}

- **Background**: {{BACKGROUND_DESCRIPTION}}
- **Overlay**: {{OVERLAY_SPECIFICATION}} (NEVER flat bg-black/50 — use gradient masks)
- **Content Layout**: {{LAYOUT_CLASSES}}
- **Headline**: "{{HEADLINE_COPY}}" — {{HEADLINE_CLASSES}}
- **Subtitle**: "{{SUBTITLE_COPY}}" — {{SUBTITLE_CLASSES}}
- **CTAs**:
  - Primary: "{{PRIMARY_CTA_TEXT}}" — {{PRIMARY_BUTTON_CLASSES}}
  - Secondary: "{{SECONDARY_CTA_TEXT}}" — {{SECONDARY_BUTTON_CLASSES}}

### 6. REMAINING SECTIONS
[Specify each section with the same level of detail as the Hero]
- Section title
- Content layout
- Component specifications
- Image descriptions
- Animation timing

***`;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function printFramework() {
  console.log('\n=== FRAMEWORK: Hero-First Architecture for Website Build Prompts ===\n');
  console.log(FRAMEWORK.description);

  console.log('\n\n=== 6 HERO ARCHETYPES ===\n');
  Object.entries(FRAMEWORK.archetypes).forEach(([key, archetype]) => {
    console.log(`${key}. ${archetype.name}`);
    console.log(`   ${archetype.description}`);
    console.log(`   Best for: ${archetype.bestFor.join(', ')}`);
    console.log('');
  });

  console.log('\n=== ENTRANCE CHOREOGRAPHY SYSTEMS ===\n');
  Object.entries(FRAMEWORK.choreographies).forEach(([key, chore]) => {
    console.log(`• ${chore.name}`);
    console.log(`  ${chore.description}`);
    console.log('');
  });

  console.log('\n=== ANTI-SLOP RULES (Banned Patterns) ===\n');
  Object.entries(FRAMEWORK.antiSlop).forEach(([category, rules]) => {
    console.log(`${category}:`);
    rules.forEach(rule => console.log(`  • ${rule}`));
    console.log('');
  });

  console.log('\n=== CSS EFFECTS LIBRARY ===\n');
  console.log('Available effects (copy-paste ready):');
  Object.keys(FRAMEWORK.cssEffects).forEach(effect => {
    console.log(`  • .${effect}`);
  });

  console.log('\n\n=== AVAILABLE PROMPT TYPES ===\n');
  Object.entries(PROMPT_TEMPLATES).forEach(([type, meta]) => {
    console.log(`${type.toUpperCase()}`);
    console.log(`  ${meta.description}`);
    console.log(`  Sections: ${meta.template.sections.join(' → ')}`);
    console.log('');
  });

  printFooter();
}

function printPromptType(type) {
  const template = PROMPT_TEMPLATES[type.toLowerCase()];

  if (!template) {
    console.error(`\nError: Unknown prompt type "${type}"`);
    console.log('Available types:', Object.keys(PROMPT_TEMPLATES).join(', '));
    process.exit(1);
  }

  console.log(`\n=== ${type.toUpperCase()} PROMPT TEMPLATE ===\n`);
  console.log(`Purpose: ${template.description}\n`);
  console.log('Sections:', template.template.sections.join(' → '));
  console.log('\nVariables to fill in:');
  template.template.variables.forEach(v => console.log(`  ${v}`));

  console.log('\n\nFull Prompt Template:\n');
  console.log('***\n');
  console.log(FULL_PROMPT_TEMPLATE);
  console.log('\n***');

  printFooter();
}

function printPromptTypeJson(type) {
  const template = PROMPT_TEMPLATES[type.toLowerCase()];

  if (!template) {
    console.error(`Error: Unknown prompt type "${type}"`);
    process.exit(1);
  }

  const json = {
    type: type.toLowerCase(),
    description: template.description,
    sections: template.template.sections,
    variables: template.template.variables,
    framework: {
      archetype_options: Object.fromEntries(
        Object.entries(FRAMEWORK.archetypes).map(([key, arch]) => [
          key,
          { name: arch.name, description: arch.description }
        ])
      ),
      choreography_options: Object.keys(FRAMEWORK.choreographies),
      anti_slop_rules: FRAMEWORK.antiSlop,
      css_effects: Object.keys(FRAMEWORK.cssEffects)
    },
    template: FULL_PROMPT_TEMPLATE
  };

  console.log(JSON.stringify(json, null, 2));
}

function printHelp() {
  console.log(`
Game Changer Labs — Prompt Generator for Premium Website Builds

USAGE:
  node gcl-prompts.mjs [OPTIONS]

OPTIONS:
  (no args)               Print framework overview + available prompt types
  <type>                  Print fill-in-the-blank prompt for a specific type
  <type> --json           Same as above, but output structured JSON (for AI agents)
  --help                  Show this help message

PROMPT TYPES:
  ${Object.keys(PROMPT_TEMPLATES).join(', ')}

EXAMPLES:
  node gcl-prompts.mjs
  node gcl-prompts.mjs landing
  node gcl-prompts.mjs saas --json
  node gcl-prompts.mjs portfolio

FRAMEWORK:
  This tool encodes the "Hero-First Architecture" — a systematic approach
  to writing prompts for AI code generators (v0, Lovable, Cursor, etc.)
  that produce Awwwards-level websites.

  Core components:
  • 6 Hero Archetypes (Cinematic Video, Split-Screen, Giant Typography, etc.)
  • 3 Entrance Choreography Systems (Blur-Fade-Up, WordsPullUp, BlurText)
  • Explicit Design System tokens (colors, typography, spacing)
  • Anti-Slop Rules (banned patterns that make AI output look generic)
  • CSS Effects Library (copy-paste ready: Liquid Glass, Blur Masks, etc.)

For more details, run "node gcl-prompts.mjs" with no arguments.
`);
}

function printFooter() {
  console.log('\n— Built by Game Changer Labs · https://gamechangerlabs.io');
  console.log('  Want a site designed and built for real? That\'s what we do.\n');
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  const args = process.argv.slice(2);
  const isJson = args.includes('--json');

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  // First non-flag argument is the prompt type (if any).
  const type = args.find((a) => !a.startsWith('-'));

  if (!type) {
    // No type given: emit a discovery payload so AI agents can list options.
    if (isJson) {
      console.log(
        JSON.stringify(
          {
            tool: 'gcl-prompts',
            framework: 'Hero-First Architecture',
            description: FRAMEWORK.description,
            available_types: Object.keys(PROMPT_TEMPLATES),
            usage: 'gcl-prompts <type> [--json]',
            attribution: 'Built by Game Changer Labs · https://gamechangerlabs.io',
          },
          null,
          2,
        ),
      );
    } else {
      printFramework();
    }
    return;
  }

  if (isJson) {
    printPromptTypeJson(type);
  } else {
    printPromptType(type);
  }
}

main();
