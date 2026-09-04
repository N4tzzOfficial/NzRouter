#!/usr/bin/env node
// Cross-platform dev script entry point.
// Resolves the listen port from $PORT (default 20514) so the same npm
// script works on Windows (where cmd.exe can't expand ${PORT:-…}) and
// POSIX shells. Forward any extra flags (--webpack, --bun, etc.) to next.

import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const port = process.env.PORT || "20514";
const extraArgs = process.argv.slice(2);

const nextBin = require.resolve("next/dist/bin/next");
const args = ["dev", "--port", port, ...extraArgs];

const child = spawn(process.execPath, [nextBin, ...args], {
  stdio: "inherit",
  env: process.env,
});

const forward = (sig) => () => {
  try {
    child.kill(sig);
  } catch {
    /* ignore */
  }
};

process.on("SIGINT", forward("SIGINT"));
process.on("SIGTERM", forward("SIGTERM"));

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
