<div align="center">

# ⚡ N4tzzOfficial — AI Router

### One endpoint. Every AI provider. Zero downtime.

**N4tzzOfficial is a self-hosted AI router & token-saver.**
It exposes a single OpenAI-compatible endpoint at `http://localhost:20514/v1` and routes
your traffic to 40+ providers — with format translation, multi-account fallback,
OAuth token refresh, quota tracking, and 20–40% token savings baked in.

```bash
npm i -g nzrouter
nzrouter
```

Dashboard → `http://localhost:20514/dashboard` &nbsp;·&nbsp; API → `http://localhost:20514/v1`

</div>

---

## 🎯 What you get

| | |
|---|---|
| 🚀 **One endpoint, 40+ providers** | OpenAI, Claude, Gemini, Codex, Cursor, Kiro, OpenCode, GLM, MiniMax, Kimi, Vertex, … |
| 🔁 **3-tier auto fallback** | Subscription → Cheap → Free. Never hit a wall mid-coding. |
| 💸 **RTK token saver** | Auto-compress `git diff` / `grep` / `ls` / `tree` / `log` outputs. **−20–40% input tokens** on every request. |
| 🔄 **Format translation** | OpenAI ↔ Claude ↔ Gemini ↔ Cursor ↔ Kiro ↔ Vertex ↔ Ollama. |
| 👥 **Multi-account** | Round-robin OAuth accounts per provider, automatic token refresh. |
| 🧩 **Combos** | Mix subscription, cheap, and free models into one named stack. |
| 📊 **Quota & usage** | Live per-provider usage, reset countdowns, monthly cost estimates. |
| 🖥 **Universal CLI** | Works with Claude Code, Codex, Cursor, Cline, Continue, OpenClaw, Kilo, Roo, … |
| 🔐 **Secure by default** | Bearer API key on `/v1/*`, local-only dashboard by default, JWT session cookie. |
| 🪟 **Tray + background** | Windows/macOS/Linux tray app; `--background` / `--daemon` for headless servers. |
| 🔄 **Auto-update** | Built-in background checker: every 6 h it `git pull`s, rebuilds, and restarts. |
| 💰 **Free forever** | N4tzzOfficial itself never charges. You only pay upstream providers you use. |

---

## ⚡ Install

### From npm (recommended)

```bash
npm i -g nzrouter
nzrouter
```

### From source (fallback)

```bash
git clone https://github.com/N4tzzOfficial/NzRouter.git C:/NzRouter
cd C:/NzRouter
npm install
npm run build
```

If a previous broken global install left junk behind, clean it first:

```bash
npm rm -g nzrouter
rmdir /s /q "%AppData%\npm\node_modules\nzrouter"   # Windows
del /q "%AppData%\npm\nzrouter*"                    # Windows shims
# rm -rf "$(npm root -g)/nzrouter"                  # macOS/Linux
# rm -f "$(npm root -g)/../bin/nzrouter*"           # macOS/Linux shims
npm i -g nzrouter
```

> First login password: **`nzrouter123`** — change it in **Dashboard → Profile** immediately.

### From source (development)

```bash
git clone https://github.com/N4tzzOfficial/NzRouter.git
cd NzRouter
cp .env.example .env
npm install
PORT=20514 NEXT_PUBLIC_BASE_URL=http://localhost:20514 npm run dev
```

### Production build

```bash
npm run build
PORT=20514 HOSTNAME=0.0.0.0 NEXT_PUBLIC_BASE_URL=http://localhost:20514 npm run start
```

### Docker

```bash
docker run -d \
  --name nzrouter \
  -p 20514:20514 \
  -v "$HOME/.nzrouter:/app/data" \
  -e DATA_DIR=/app/data \
  N4tzzOfficial/N4tzzOfficial:latest
```

Default URLs:

- **Dashboard** → `http://localhost:20514/dashboard`
- **OpenAI-compatible API** → `http://localhost:20514/v1`
- **First login password** → `nzrouter123` (set `INITIAL_PASSWORD` to override)

---

## 🔌 Connect a provider

Open the dashboard, then:

**Free (no signup, no card):**

1. **Kiro AI** — ~50 credits/month free: Claude 4.5, GLM-5, MiniMax via AWS Builder ID / Google / GitHub OAuth.
2. **OpenCode Free** — no auth at all; models auto-fetched.
3. **Vertex AI** — $300 free credits on new GCP accounts (use Vertex AI Studio endpoint).

**Subscriptions you may already have:**

- Claude Code (Pro / Max) → 5 h + weekly quota
- OpenAI Codex (Plus / Pro) → 5 h + weekly quota
- GitHub Copilot → monthly reset
- Cursor IDE → monthly

**Cheap APIs (pay-as-you-go):**

- GLM-5.1 / GLM-4.7 → $0.6 / 1M
- MiniMax M2.7 → $0.20 / 1M (1 M context, 5 h reset)
- Kimi K2.5 → $9/month flat (10 M tokens)

---

## 🛠 Use in your CLI tool

```
Endpoint: http://localhost:20514/v1
API Key:  <copy from Dashboard → Profile>
Model:    kr/claude-sonnet-4.5     # or any of 100+ models
```

| Tool | Config |
|---|---|
| **Claude Code** | `~/.claude/config.json` → `anthropic_api_base` / `anthropic_api_key` |
| **Codex CLI** | `OPENAI_BASE_URL=http://localhost:20514` `OPENAI_API_KEY=…` |
| **Cursor IDE** | Settings → Models → Advanced → OpenAI API Base URL + Key |
| **Cline / Continue / Roo** | Provider: *OpenAI Compatible* → Base URL + Key |
| **OpenClaw** | Provider entry in `~/.openclaw/openclaw.json` |

Combo example — name a stack `premium-coding`:

```
1. cc/claude-opus-4-7     ← your subscription
2. glm/glm-5.1            ← cheap backup
3. kr/claude-sonnet-4.5   ← free fallback
```

Then use model `premium-coding` in any tool. N4tzzOfficial walks the list on every error.

---

## 🧠 The full request flow

```
┌────────────────┐
│  Your CLI tool │   Claude Code · Codex · Cursor · Cline · OpenClaw · …
└───────┬────────┘
        │  http://localhost:20514/v1
        ↓
┌──────────────────────────────────────────────┐
│           N4tzzOfficial (smart router)       │
│  • RTK token saver (cut tool_result tokens)  │
│  • Format translation (OpenAI ↔ Claude …)    │
│  • Combo expansion + account rotation        │
│  • Quota tracking + OAuth auto-refresh       │
└───────┬──────────────────────────────────────┘
        │
        ├─→ [Tier 1 · SUBSCRIPTION]  Claude Code · Codex · GitHub · Cursor
        │        ↓ quota exhausted
        ├─→ [Tier 2 · CHEAP]         GLM ($0.6/1M) · MiniMax ($0.2/1M) · Kimi
        │        ↓ budget limit
        └─→ [Tier 3 · FREE]          Kiro · OpenCode Free · Vertex ($300 credits)
```

---

## 💡 Key features

### RTK token saver
Tool outputs (`git diff`, `grep`, `ls`, `tree`, log dumps, …) eat 30–50% of your prompt budget. RTK detects them and applies lossless compression **before** the request hits the LLM. Fail-open: if a filter breaks, the original text is sent. Errors never break your request.

```
Without RTK: 47K tokens sent
With RTK:    28K tokens sent   (40% saved · same context · same answer)
```

Set `X-N4tzzOfficial-Token-Saver: off` to bypass for one request.

### Smart 3-tier fallback
Stack any combination of models. When one errors or hits quota, N4tzzOfficial walks the list automatically — no manual switching.

### Multi-account round-robin
Add several OAuth accounts per provider. N4tzzOfficial rotates through them and auto-refreshes tokens before they expire.

### Format translation
Your CLI sends OpenAI chat completions. N4tzzOfficial translates to the upstream's native format on the way out, and back on the way in. You don't have to think about it.

### Combos
Name a stack once (`premium-coding`, `free-forever`, `always-on`) and use it everywhere. Mix and match subscription + cheap + free.

### Real-time quota tracking
Live per-provider usage, 5 h / daily / weekly reset countdowns, monthly cost estimates. Maximize the value of every subscription you already pay for.

### Auto-update
A background executor checks the GitHub release every 6 hours, and when a new version ships it does the full cycle: `git pull --rebase` → `npm install` → `npm run build` → graceful restart. Configurable via `NZROUTER_REPO_PATH` and `NZROUTER_SKIP_UPDATE=1`.

### Tray + background modes

```bash
nzrouter                       # interactive + tray
nzrouter --background          # start in background (no tray, no console)
nzrouter --daemon              # same as --background
nzrouter --no-browser          # don't auto-open dashboard
nzrouter --port 9000           # custom port
nzrouter --skip-update         # skip auto-update on this run
```

---

## 🔐 Security defaults

- **API key required on `/v1/*`** — every request must carry `Authorization: Bearer <key>`. Toggle off in Dashboard → Profile only if you fully trust your network.
- **Dashboard is local-only by default** — remote requests get a clear 401 / 403 response.
- **JWT session cookie** signed with `JWT_SECRET` (auto-generated on first run; override in `.env`).
- **Real client IP** from the TCP socket — not from `X-Forwarded-For` headers (you can opt back in via reverse-proxy config).
- **OAuth state + PKCE** with cryptographic nonces.
- **API keys are HMAC-hashed** with `API_KEY_SECRET` (set this in `.env` for production).

> **REQUIRE_API_KEY is ON by default.** If `/v1/*` returns `Wow, you idiot, N4tzzOfficial won't work without the API KEY, you idiot` — set an API key in **Dashboard → Profile**.

---

## ⚙️ Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | framework default | Service port (`20514` in examples) |
| `HOSTNAME` | framework default | Bind host (Docker: `0.0.0.0`) |
| `INITIAL_PASSWORD` | `nzrouter123` | First-login password (change it!) |
| `JWT_SECRET` | auto-generated | JWT session cookie secret |
| `API_KEY_SECRET` | placeholder | HMAC secret for issued API keys |
| `MACHINE_ID_SALT` | placeholder | Salt for stable machine-id hashing |
| `DATA_DIR` | `~/.nzrouter` | SQLite + settings + keys location |
| `BASE_URL` | `http://localhost:20514` | Server-side internal base URL |
| `CLOUD_URL` | `https://n4tzzofficial.my.id/nzrouter/` | Cloud sync endpoint base |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Backward-compatible public URL |
| `REQUIRE_API_KEY` | `true` | Enforce Bearer API key on `/v1/*` |
| `ENABLE_REQUEST_LOGS` | `false` | Write `logs/` request/response traces |
| `AUTH_COOKIE_SECURE` | `false` | Force `Secure` on session cookie |
| `NZROUTER_SKIP_UPDATE` | unset | Set to `1` to disable auto-update |
| `NZROUTER_REPO_PATH` | auto-detected | Override repo root for the background executor |

---

## 🆘 Troubleshooting

**`Wow, you idiot, N4tzzOfficial won't work without the API KEY, you idiot`**
Your CLI tool isn't sending the API key. Copy it from **Dashboard → Profile** and pass it as `Authorization: Bearer <key>` (or set the tool's `API Key` field).

**Rate limit / quota exhausted**
Add a fallback tier in a combo: `cc/claude-opus-4-7 → glm/glm-5.1 → kr/claude-sonnet-4.5`.

**OAuth token expired**
Auto-refreshed by N4tzzOfficial. If it keeps failing, reconnect from **Dashboard → Providers**.

**Dashboard opens on wrong port**
Set `PORT=20514` and `NEXT_PUBLIC_BASE_URL=http://localhost:20514` before `npm run start`.

**First login not working**
Default password is `nzrouter123`. Override with `INITIAL_PASSWORD` in `.env`.

**`/v1/*` blocked locally**
By default the dashboard is local-only. From a remote machine, set up a reverse proxy or use `--hostname 0.0.0.0` and configure `JWT_SECRET` / `API_KEY_SECRET`.

---

## 🛠 Tech stack

- **Runtime** — Node.js 20+
- **Framework** — Next.js 16, React 19, Tailwind CSS 4
- **Database** — SQLite (`bun:sqlite` → `better-sqlite3` → `node:sqlite` → `sql.js` fallback chain)
- **Streaming** — Server-Sent Events (SSE)
- **Auth** — OAuth 2.0 (PKCE) + JWT session cookies + HMAC API keys
- **CLI** — Node, optional system tray

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

Built with ❤️ by **N4tzzOfficial**

[Website](https://n4tzzofficial.my.id/nzrouter/) · [GitHub](https://github.com/N4tzzOfficial/NzRouter) · [Issues](https://github.com/N4tzzOfficial/NzRouter/issues)

</div>
