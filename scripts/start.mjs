#!/usr/bin/env node
// Cross-platform production start entry point.
// Resolves the listen port from $PORT (default 20514), then exec's the
// CJS custom-server.js so it owns the listening socket (it derives the
// real client IP from the TCP socket — see custom-server.js for details).

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const port = process.env.PORT || "20514";

const child = spawn(process.execPath, [path.join(root, "custom-server.js"), "--port", port], {
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
