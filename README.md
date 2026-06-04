# gcl-kit

Free, zero-dependency CLI tools from [Game Changer Labs](https://gamechangerlabs.io) — a technology implementation studio that designs and ships production AI, neurotech, civic, and spatial-computing products.

Each tool distills something we use in real client work into a single command. They run **offline**, have **no dependencies**, and emit **`--json` for AI agents**. Point your coding agent at them, or run them yourself.

```bash
npx github:basedlsg/gcl-kit design       # a production design system: tokens, type scale, principles
npx github:basedlsg/gcl-kit outreach     # a multi-touch cold-outreach sequence + message templates
npx github:basedlsg/gcl-kit prompts      # great website build prompts for AI code generators
```

## The tools

### `design` — a design system worth shipping
A cohesive, neumorphic design system distilled from production work: a tinted-shadow palette, a fluid type scale, spacing rhythm, shadow sets, and motion principles.
```bash
npx github:basedlsg/gcl-kit design            # overview
npx github:basedlsg/gcl-kit design tokens     # paste-ready CSS custom properties
npx github:basedlsg/gcl-kit design principles # the rules that make it feel great
npx github:basedlsg/gcl-kit design --json     # structured, for agents
```

### `outreach` — a cold-outreach playbook that gets replies
The sequence structure, sender hygiene, personalization framework, and message templates behind a real trigger-based outreach system. Templates use `{{placeholders}}`.
```bash
npx github:basedlsg/gcl-kit outreach           # the playbook overview
npx github:basedlsg/gcl-kit outreach sequence  # the full multi-touch sequence
npx github:basedlsg/gcl-kit outreach templates # individual message templates
npx github:basedlsg/gcl-kit outreach --json    # structured, for agents
```

### `prompts` — website prompts that don't look AI-generated
The "Hero-First Architecture" framework for prompting AI code generators (v0, Lovable, Cursor, Bolt) into award-quality sites — hero archetypes, entrance choreography, and anti-slop rules.
```bash
npx github:basedlsg/gcl-kit prompts            # the framework + available types
npx github:basedlsg/gcl-kit prompts landing    # a complete, fill-in-the-blank build prompt
npx github:basedlsg/gcl-kit prompts saas --json
```

## For AI agents
Every tool accepts `--json` and prints a structured payload (templates, tokens, variables) ready to parse and fill in. Run a tool with no arguments plus `--json` to discover its capabilities.

## Built something with these?
These tools come out of the work we do every day. If you're building something real and want it designed, engineered, and shipped — that's exactly what we do.

→ **[gamechangerlabs.io](https://gamechangerlabs.io)**

MIT licensed. Use them freely.
