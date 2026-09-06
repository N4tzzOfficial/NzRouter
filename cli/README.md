# N4tzzOfficial CLI

The launcher for the N4tzzOfficial self-hosted AI router.

```bash
npm install -g git+https://github.com/N4tzzOfficial/NzRouter#master:cli
nzrouter
```

Dashboard → `http://localhost:20514/dashboard` &nbsp;·&nbsp; API → `http://localhost:20514/v1`
First-login password: **`nzrouter123`** (change in Dashboard → Profile).

---

## What it does

- **Installs and starts** the N4tzzOfficial server (Next.js + SQLite).
- **System tray** with quick links: dashboard, API key, restart, update, quit.
- **Background / daemon mode** for headless servers.
- **Auto-update** — every 6 h the background executor checks the GitHub release, then
  `git pull --rebase` → `npm install` → `npm run build` → graceful restart.
- **Data directory** at `~/.nzrouter/` (macOS/Linux) or `%APPDATA%\nzrouter\` (Windows).
  In Docker, mount `/app/data`.

---

## Usage

```bash
nzrouter                       # start with default settings (interactive)
nzrouter --background          # run in background (no tray, no console)
nzrouter --daemon              # alias for --background
nzrouter --no-browser          # don't open the dashboard on start
nzrouter --port 9000           # custom port
nzrouter --skip-update         # skip the auto-update check on this run
nzrouter --version             # print version and exit
nzrouter --help                # full option list
```

When started without `--background`, the CLI runs an interactive terminal UI plus an
optional system tray. Use `--background` (or `--daemon`) for servers / WSL / SSH.

---

## Install

### From GitHub (recommended, always latest)

> The launcher lives in the `cli/` subfolder. `npm install -g git+https://…`
> without a subfolder pulls the **whole monorepo** (Next.js + dashboard deps)
> and hits `TAR_ENTRY_ERROR` on Windows — don't use it. Always install from
> the `cli/` subfolder:

```bash
npm install -g git+https://github.com/N4tzzOfficial/NzRouter#master:cli
nzrouter --version
nzrouter
```

If a previous broken global install left junk behind, clean it first:

```bash
npm rm -g nzrouter
rmdir /s /q "%AppData%\npm\node_modules\nzrouter"   # Windows
# rm -rf "$(npm root -g)/nzrouter"                  # macOS/Linux
npm install -g git+https://github.com/N4tzzOfficial/NzRouter#master:cli
```

### From npm (when published)

```bash
npm install -g nzrouter
nzrouter
```

### From source (development)

```bash
git clone https://github.com/N4tzzOfficial/NzRouter.git
cd NzRouter/cli
npm install
node cli.js
```

---

## Data location

| Platform | Path |
|---|---|
| macOS / Linux | `~/.nzrouter/db/data.sqlite` |
| Windows | `%APPDATA%\nzrouter\db\data.sqlite` |
| Docker | `/app/data/db/data.sqlite` (mount `$HOME/.nzrouter` to persist) |

Other artifacts:

- `~/.nzrouter/jwt-secret` — auto-generated JWT signing secret
- `~/.nzrouter/usage.json` + `log.txt` — usage history (does **not** follow `DATA_DIR`)
- `~/.nzrouter/runtime/node_modules/` — SQLite + tray runtime deps (self-healed on start)

---

## Configuration

The CLI reads its config from the same `.env` and SQLite store as the server. Relevant
variables (all optional, set in `.env` or in your shell):

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | framework default | Service port (use `20514` to match the README examples) |
| `HOSTNAME` | framework default | Bind host (`0.0.0.0` for Docker / remote access) |
| `INITIAL_PASSWORD` | `nzrouter123` | First-login password (change immediately) |
| `JWT_SECRET` | auto | JWT session cookie secret |
| `API_KEY_SECRET` | placeholder | HMAC secret for issued API keys |
| `DATA_DIR` | `~/.nzrouter` | SQLite + settings + keys location |
| `REQUIRE_API_KEY` | `true` | Enforce Bearer API key on `/v1/*` |
| `NZROUTER_SKIP_UPDATE` | unset | Set to `1` to disable the auto-update check |
| `NZROUTER_REPO_PATH` | auto-detected | Override repo root for the background executor |

---

## Updates

The CLI ships with a background executor that runs every 6 hours. When a newer
`releases/latest` is published on GitHub it:

1. `git fetch origin`
2. `git pull --rebase`
3. `npm install` (root + `cli/`)
4. `npm run build` (root + `cli/`)
5. Restart the server (SIGTERM + port cleanup)

Disable per-run with `nzrouter --skip-update`, or persistently with
`NZROUTER_SKIP_UPDATE=1`.

---

## Troubleshooting

**`nzrouter: command not found`**
The npm global bin directory isn't on `PATH`. Add `$(npm config get prefix)/bin` (macOS/Linux)
or `%AppData%\npm` (Windows) to your `PATH`, then restart the shell.

**Port 20514 already in use**
Pick another port: `nzrouter --port 9000`. Update any CLI tools pointing at `20514` too.

**`Wow, you idiot, N4tzzOfficial won't work without the API KEY, you idiot`**
Your tool isn't sending the API key. Copy it from **Dashboard → Profile** and set it as
`Authorization: Bearer <key>` (or the tool's *API Key* field).

**Auto-update fails**
Make sure the install is a git checkout (not a tarball from npm), and that `git`,
`node`, and `npm` are on `PATH`. Check the server logs in `~/.nzrouter/log.txt`.

**Tray icon doesn't appear**
Tray is a desktop feature — disable it on headless servers with `nzrouter --background`.

---

## License

MIT — see [LICENSE](../LICENSE).
