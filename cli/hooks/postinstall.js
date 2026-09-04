#!/usr/bin/env node

// Postinstall: warm-up SQLite deps into ~/.nzrouter/runtime so the first
// `nzrouter` start doesn't need network. Failure here is non-fatal —
// cli.js will retry at runtime if anything is missing.
const { ensureSqliteRuntime } = require("./sqliteRuntime");
const { ensureTrayRuntime } = require("./trayRuntime");

try {
  ensureSqliteRuntime({ silent: false });
  console.log("[nzrouter] runtime SQLite deps ready");
} catch (e) {
  console.warn(`[nzrouter] runtime warm-up skipped: ${e.message}`);
}

try {
  ensureTrayRuntime({ silent: false });
} catch (e) {
  console.warn(`[nzrouter] tray runtime skipped: ${e.message}`);
}

process.exit(0);
