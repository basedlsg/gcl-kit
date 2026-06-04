#!/usr/bin/env node

/**
 * gcl — dispatcher for the Game Changer Labs CLI kit.
 *
 * Routes to the standalone tools (design / outreach / prompts). Each tool is
 * self-contained, dependency-free, and works offline. Add --json to any tool
 * for machine-readable output meant for AI agents.
 *
 * https://gamechangerlabs.io
 */

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

const TOOLS = {
  design: "gcl-design.mjs",
  outreach: "gcl-outreach.mjs",
  prompts: "gcl-prompts.mjs",
};

function usage() {
  console.log(`gcl — free tools from Game Changer Labs · https://gamechangerlabs.io

Usage:  npx github:basedlsg/gcl-kit <tool> [args] [--json]

Tools:
  design     A production design system — tokens, type scale, principles
  outreach   A multi-touch cold-outreach sequence and message templates
  prompts    Great website build prompts for AI code generators

Add --json to any tool for structured output (built for AI agents).

Examples:
  npx github:basedlsg/gcl-kit design tokens
  npx github:basedlsg/gcl-kit outreach sequence
  npx github:basedlsg/gcl-kit prompts landing --json

Built these into your project? We design and ship production systems for real —
https://gamechangerlabs.io
`);
}

const [cmd, ...rest] = process.argv.slice(2);

if (!cmd || cmd === "--help" || cmd === "-h") {
  usage();
  process.exit(0);
}

if (!TOOLS[cmd]) {
  console.error(`Unknown tool: ${cmd}\n`);
  usage();
  process.exit(1);
}

const child = spawn(process.execPath, [join(here, TOOLS[cmd]), ...rest], {
  stdio: "inherit",
});
child.on("exit", (code) => process.exit(code ?? 0));
