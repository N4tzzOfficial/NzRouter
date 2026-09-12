<div align="center">

# <span style="color:#00B4FF">NzRouter</span>

### Self-hosted AI routing gateway with OpenAI-compatible `/v1` endpoint

**One endpoint. 40+ providers. Zero downtime.**

NzRouter exposes a single **OpenAI-compatible** endpoint at `http://localhost:20514/v1` and intelligently routes your traffic across **40+ upstream providers** — with format translation, model-combo fallback, multi-account rotation, OAuth PKCE + token refresh, quota/usage tracking, and **20–40% token savings** via RTK compression.

```bash
npx nzrouter@latest
```

**Dashboard** → `http://localhost:20514/dashboard` &nbsp;·&nbsp; **API** → `http://localhost:20514/v1`

</div>

---

## 🎯 What you get

| Feature | Description |
|---------|-------------|
| 🚀 **One endpoint, 40+ providers** | OpenAI, Anthropic, Google Gemini, Codex, Cursor, Kiro, OpenCode, GLM, MiniMax, Kimi, Vertex AI, Perplexity, xAI Grok, DeepSeek, Qoder, Poolside, TokenRouter, and many more |
| 🔁 **3-tier auto fallback** | Subscription → Cheap → Free. Never hit a wall mid-coding |
| 💸 **RTK Token Saver** | Auto-compress `git diff`, `grep`, `ls`, `tree`, log outputs. **−20–40% input tokens** on every request |
| 🔄 **Format translation** | OpenAI ↔ Anthropic ↔ Gemini ↔ Cursor ↔ Kiro ↔ Vertex ↔ Ollama. Transparent to your tools |
| 👥 **Multi-account round-robin** | Add several OAuth accounts per provider. NzRouter rotates through them and auto-refreshes tokens |
| 🧩 **Model combos** | Mix subscription, cheap, and free models into one named stack with fallback/round-robin/fusion strategies |
| 📊 **Quota & usage tracking** | Live per-provider usage, reset countdowns, monthly cost estimates |
| 🖥 **Universal CLI support** | Works with Claude Code, Codex, Cursor, Cline, Continue, OpenClaw, Kilo, Roo, Amp, jcode, and any OpenAI-compatible SDK |
| 🔐 **Secure by default** | Bearer API key on `/v1/*`, local-only dashboard, JWT session cookie, real client IP from TCP socket |
| 🪟 **Tray + background modes** | Windows/macOS/Linux tray app; `--background` / `--daemon` for headless servers |
| 🔄 **Auto-update** | Background checker every 6h: `git pull` → `npm install` → `npm run build` → graceful restart |
| 💰 **Free forever** | NzRouter itself never charges. You only pay upstream providers you use |

---

## ⚡ Quick Start

### One-liner (recommended)
```bash
npx nzrouter@latest
```

### Global install
```bash
npm i -g nzrouter
nzrouter
```

### Docker
```bash
docker run -d \
  --name nzrouter \
  -p 20514:20514 \
  -v "$HOME/.nzrouter:/app/data" \
  -e DATA_DIR=/app/data \
  N4tzzOfficial/nzrouter:latest
```

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

**Default URLs:**
- **Dashboard** → `http://localhost:20514/dashboard`
- **OpenAI-compatible API** → `http://localhost:20514/v1`
- **First login password** → `nzrouter123` (set `INITIAL_PASSWORD` in `.env` to override)

> ⚠️ **Change the default password immediately** in Dashboard → Profile after first login.

---

## 🔌 Connect a Provider

Open the dashboard at `http://localhost:20514/dashboard`, go to **Providers**, and add connections.

### Free (no signup, no card)
| Provider | Details |
|----------|---------|
| **Kiro AI** | ~50 credits/month free: Claude 4.5, GLM-5, MiniMax via AWS Builder ID / Google / GitHub OAuth |
| **OpenCode Free** | No auth required; models auto-fetched |
| **Vertex AI** | $300 free credits on new GCP accounts (use Vertex AI Studio endpoint) |
| **Mimo Free** | No-auth provider with vision support |

### Subscriptions you may already have
| Provider | Quota |
|----------|-------|
| **Claude Code** (Pro/Max) | 5h + weekly quota |
| **OpenAI Codex** (Plus/Pro) | 5h + weekly quota |
| **GitHub Copilot** | Monthly reset |
| **Cursor IDE** | Monthly |

### Cheap APIs (pay-as-you-go)
| Provider | Pricing |
|----------|---------|
| **GLM-5.1 / GLM-4.7** | $0.60 / 1M tokens |
| **MiniMax M2.7** | $0.20 / 1M tokens (1M context, 5h reset) |
| **Kimi K2.5** | $9/month flat (10M tokens) |
| **TokenRouter** | 300+ models via OpenAI-compatible gateway |

---

## 🛠 Use in Your CLI Tool

```
Endpoint: http://localhost:20514/v1
API Key:  <copy from Dashboard → Profile>
Model:    kr/claude-sonnet-4.5     # or any of 100+ models
```

| Tool | Configuration |
|------|---------------|
| **Claude Code** | `~/.claude/config.json` → `anthropic_api_base` / `anthropic_api_key` |
| **Codex CLI** | `OPENAI_BASE_URL=http://localhost:20514` `OPENAI_API_KEY=...` |
| **Cursor IDE** | Settings → Models → Advanced → OpenAI API Base URL + Key |
| **Cline / Continue / Roo** | Provider: *OpenAI Compatible* → Base URL + Key |
| **OpenClaw** | Provider entry in `~/.openclaw/openclaw.json` |
| **Kilo Code** | Settings → Provider → OpenAI Compatible |
| **Amp** | Use NzRouter model aliases to keep shorthand mappings stable |

### Combo Example — name a stack `premium-coding`

```
1. cc/claude-opus-4.7     ← your subscription
2. glm/glm-5.1            ← cheap backup
3. kr/claude-sonnet-4.5   ← free fallback
```

Then use model `premium-coding` in any tool. NzRouter walks the list on every error.

---

## 🧠 Request Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        YOUR CLI TOOLS                                       │
│  Claude Code · Codex · Cursor · Cline · OpenClaw · Kilo · Amp · Continue   │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ http://localhost:20514/v1
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NZROUTER GATEWAY (Next.js)                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  src/sse/handlers/chat.js                                           │   │
│  │  • Parse request & resolve model/combo                              │   │
│  │  • RTK Token Saver (compress tool_result)                          │   │
│  │  • Combo expansion + account selection loop                        │   │
│  └─────────────────────────────────┬──────────────────────────────────┘   │
│                                    │                                      │
│                                    ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  open-sse/handlers/chatCore.js (provider-agnostic engine)         │   │
│  │  • Detect source format (OpenAI/Responses/Claude/Gemini)          │   │
│  │  • Translate request → provider format                             │   │
│  │  • Dispatch to executor + retry/refresh on 401/403                │   │
│  │  • Translate response stream → client format                      │   │
│  └─────────────────────────────────┬──────────────────────────────────┘   │
│                                    │                                      │
│              ┌─────────────────────┼─────────────────────┐               │
│              ▼                     ▼                     ▼               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │ TIER 1: SUB      │  │ TIER 2: CHEAP    │  │ TIER 3: FREE     │       │
│  │ cc/claude-*      │  │ glm/glm-5.1      │  │ kr/claude-4.5    │       │
│  │ cx/gpt-5.*       │  │ mx/minimax-m2.7  │  │ oc/big-pickle    │       │
│  │ gh/gpt-4o        │  │ km/kimi-k2.5     │  │ vertex/gemini    │       │
│  │ cursor/*         │  │                  │  │                  │       │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key internal components:**
- **Translation engine** (`open-sse/translator/`): Pivots through OpenAI as intermediate format. Direct routes (e.g., `claude:kiro`) skip double-hop for fragile pairs
- **Provider registry** (`open-sse/providers/registry/`): One file per provider, auto-generated index
- **Executors** (`open-sse/executors/`): Per-provider upstream call logic; `default.js` handles OpenAI-compatible upstreams
- **Persistence** (`src/lib/db/`): SQLite with driver fallback chain (`bun:sqlite` → `better-sqlite3` → `node:sqlite` → `sql.js`)
- **RTK Token Saver** (`open-sse/rtk/`): Pre-translate hooks that compress `tool_result` content in-place, fail-open

---

## 💡 Core Features Deep Dive

### RTK Token Saver
Tool outputs (`git diff`, `grep`, `ls`, `tree`, log dumps) consume 30–50% of your prompt budget. RTK detects them and applies **lossless compression before the request hits the LLM**.

```
Without RTK: 47K tokens sent
With RTK:    28K tokens sent   (40% saved · same context · same answer)
```

- **Fail-open**: if a filter errors, the original text is sent — never breaks your request
- **Skips** `is_error` / `status:"error"` results to preserve traces
- **Bypass per-request**: `X-NzRouter-Token-Saver: off` header

### Smart 3-Tier Fallback
Stack any combination of models. When one errors or hits quota, NzRouter walks the list automatically — no manual switching.

```json
{
  "name": "premium-coding",
  "models": [
    "cc/claude-opus-4.7",
    "glm/glm-5.1",
    "kr/claude-sonnet-4.5"
  ],
  "strategy": "fallback"   // or "round-robin", "fusion", "capacity"
}
```

### Multi-Account Round-Robin
Add several OAuth accounts per provider. NzRouter rotates through them and **auto-refreshes tokens before they expire**.

### Format Translation
Your CLI sends OpenAI chat completions. NzRouter translates to the upstream's native format on the way out, and back on the way in. You don't have to think about it.

| Source → Target | Notes |
|----------------|-------|
| OpenAI → Anthropic | Tools, system, images |
| OpenAI → Gemini | Function calling, multimodal |
| Anthropic → OpenAI | Thinking blocks, tool use |
| OpenAI → Kiro | Direct route (avoids double-hop) |
| OpenAI → Cursor | Protobuf envelope |

### Combo Strategies
| Strategy | Behavior |
|----------|----------|
| `fallback` | Try models in order, next on failure (default) |
| `round-robin` | Rotate models across requests to spread load |
| `fusion` | Fan out to all models in parallel, judge synthesizes answer |
| `capacity` | Auto-route images/PDFs to vision-capable models first |

### Real-Time Quota Tracking
Live per-provider usage, 5h/daily/weekly reset countdowns, monthly cost estimates. Maximize the value of every subscription you already pay for.

### Auto-Update
Background executor checks GitHub releases every 6 hours. On new version: `git pull --rebase` → `npm install` → `npm run build` → graceful restart. Configure via `NZROUTER_REPO_PATH` and `NZROUTER_SKIP_UPDATE=1`.

---

## 🖥 CLI Reference

```bash
nzrouter [options]

Options:
  -p, --port <port>       Port to run the server (default: 20514)
  -H, --host <host>       Host to bind (default: 0.0.0.0)
  -n, --no-browser        Don't open browser automatically
  -l, --log               Show server logs (default: hidden)
  -t, --tray              Run in system tray mode (background)
  -b, --background        Run in background (tray + detached)
  -d, --daemon            Run as daemon (background + auto-start on boot)
  --skip-update           Skip auto-update check on this run
  -h, --help              Show this help message
  -v, --version           Show version

Commands:
  xai video --prompt "..." --output video.mp4
                      Generate a Grok Imagine video via the running gateway
```

### Modes
| Mode | Command | Use Case |
|------|---------|----------|
| **Interactive** | `nzrouter` | TUI menu + tray icon, stays in foreground |
| **Tray only** | `nzrouter --tray` | Background tray icon, no console |
| **Background** | `nzrouter --background` | Detached, tray + server, close terminal freely |
| **Daemon** | `nzrouter --daemon` | Background + auto-start on OS boot |
| **Headless** | `nzrouter --no-browser -l` | Server logs to console, no browser/TUI |

---

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `20514` | Service port |
| `HOSTNAME` | `0.0.0.0` | Bind host (Docker: `0.0.0.0`) |
| `INITIAL_PASSWORD` | `nzrouter123` | First-login password (**override in production!**) |
| `JWT_SECRET` | auto-generated | JWT session cookie secret |
| `API_KEY_SECRET` | placeholder | HMAC secret for issued API keys |
| `MACHINE_ID_SALT` | placeholder | Salt for stable machine-id hashing |
| `DATA_DIR` | `~/.nzrouter` | SQLite + settings + keys location |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:20514` | Server-side internal base URL |
| `NEXT_PUBLIC_CLOUD_URL` | `https://n4tzzofficial.my.id/nzrouter/` | Cloud sync endpoint base |
| `REQUIRE_API_KEY` | `true` | Enforce Bearer API key on `/v1/*` |
| `ENABLE_REQUEST_LOGS` | `false` | Write `logs/` request/response traces |
| `AUTH_COOKIE_SECURE` | `false` | Force `Secure` on session cookie |
| `NZROUTER_SKIP_UPDATE` | unset | Set to `1` to disable auto-update |
| `NZROUTER_REPO_PATH` | auto-detected | Override repo root for background executor |

### Data Directory
All persistent state lives under `DATA_DIR` (default `~/.nzrouter/`):
- `db/data.sqlite` — providers, connections, combos, aliases, API keys, settings (SQLite; legacy `db.json` auto-migrated on first boot)
- `usage.json` — aggregated usage stats (independent of `DATA_DIR`)
- `log.txt` — rolling request log (independent of `DATA_DIR`)
- `mitm/` — MITM CA certs and PID files
- `tunnel/` — Cloudflare/Tailscale tunnel PID files
- `runtime/node_modules/` — self-healed `sql.js` + `better-sqlite3` (CLI only)

---

## 📊 Dashboard Overview

Access at `http://localhost:20514/dashboard`

| Page | Purpose |
|------|---------|
| **Endpoint & Key** | Copy base URL + API key, test connectivity, configure CLI tools |
| **Providers** | Add/manage OAuth & API-key connections, test, view quota |
| **Combos** | Create model stacks with fallback/round-robin/fusion/capacity strategies |
| **Analytics** | Usage charts, cost estimates, per-model/provider breakdowns |
| **Tools** | Auto-configure Claude Code, Codex, Cursor, Cline, Continue, Roo, OpenClaw, Kilo, Amp, jcode |
| **System** | Password, OIDC/SAML SSO, proxy pools, cloud sync, request logs, database backup/restore |

---

## 🔌 API Usage Examples

### cURL (Chat Completions)
```bash
curl -X POST http://localhost:20514/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kr/claude-sonnet-4.5",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'
```

### cURL (Anthropic Messages format — also supported)
```bash
curl -X POST http://localhost:20514/v1/messages \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "kr/claude-sonnet-4.5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### OpenAI SDK (Node.js)
```javascript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:20514/v1",
  apiKey: "YOUR_API_KEY",
});

const completion = await client.chat.completions.create({
  model: "premium-coding",  // combo name works!
  messages: [{ role: "user", content: "Write a hello world in Rust" }],
  stream: true,
});

for await (const chunk of completion) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}
```

### Python (openai package)
```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:20514/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="kr/claude-sonnet-4.5",
    messages=[{"role": "user", "content": "Hello!"}],
    stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content or "", end="", flush=True)
```

### List Available Models
```bash
curl http://localhost:20514/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## 🔄 Upgrade from 9Remote

If you're migrating from **9Remote** (the previous name), here's what changed:

| Aspect | 9Remote | NzRouter |
|--------|---------|----------|
| **Package name** | `9router` | `nzrouter` |
| **Binary name** | `9router` | `nzrouter` (also `n4tzzrouter` alias) |
| **Port** | 20514 | 20514 (unchanged) |
| **Data dir** | `~/.9router/` | `~/.nzrouter/` |
| **Env prefix** | `NINEROUTER_*` | `NZROUTER_*` |
| **Docker image** | `N4tzzOfficial/9router` | `N4tzzOfficial/nzrouter` |
| **Cloud sync URL** | `https://9router.io/` | `https://n4tzzofficial.my.id/nzrouter/` |

### Migration Steps
1. **Stop 9Remote** completely (tray + background processes)
2. **Install NzRouter**: `npm i -g nzrouter`
3. **Copy data** (optional, for preserved settings):
   ```bash
   # Windows
   xcopy /E "%USERPROFILE%\.9router" "%USERPROFILE%\.nzrouter"
   # macOS/Linux
   cp -r ~/.9router ~/.nzrouter
   ```
4. **Update environment variables** in your shell/profile:
   - `NINEROUTER_*` → `NZROUTER_*`
   - `DATA_DIR` if customized
5. **Run NzRouter**: `nzrouter`
6. **Update CLI tools** to point to `http://localhost:20514/v1` (same URL)
7. **Verify** in Dashboard → Providers that all connections show "Connected"

> **Note**: The database schema is compatible. Your provider connections, combos, aliases, and API keys will migrate automatically.

---

## 🍴 Fork from 9Remote — What Changed

NzRouter is a **continuation** of 9Remote with a new brand identity. The codebase is the same lineage — no hard fork.

### Brand Changes
- **Name**: 9Remote → **NzRouter**
- **Author branding**: Unified under **N4tzzOfficial**
- **Color**: Terracotta/orange → **Cyan #00B4FF**
- **npm scope**: `@n4tzzofficial` (future) / `nzrouter` (current)

### Technical Improvements Since Rename
- **Port unification**: Canonical `20514` everywhere (was inconsistent)
- **CLI hardening**: Proper Windows shims, no more `decolua`/`9router` leftovers
- **Install fix**: Global install from `cli/` subfolder, root package no longer owns the binary
- **Build reliability**: `better-sqlite3` in `optionalDependencies`, `sql.js` pure-JS fallback always works
- **Security**: Real client IP from TCP socket, stripped attacker-controlled `X-Forwarded-For`
- **Auto-update**: Background executor does full rebuild cycle, not just version check

---

## 🛠 Troubleshooting

| Issue | Solution |
|-------|----------|
| `"Wow, you idiot, NzRouter won't work without the API KEY, you idiot"` | Your CLI tool isn't sending the API key. Copy it from **Dashboard → Profile** and pass as `Authorization: Bearer <key>` |
| Rate limit / quota exhausted | Add a fallback tier in a combo: `cc/claude-opus-4.7 → glm/glm-5.1 → kr/claude-sonnet-4.5` |
| OAuth token expired | Auto-refreshed by NzRouter. If it keeps failing, reconnect from **Dashboard → Providers** |
| Dashboard opens on wrong port | Set `PORT=20514` and `NEXT_PUBLIC_BASE_URL=http://localhost:20514` before `npm run start` |
| First login not working | Default password is `nzrouter123`. Override with `INITIAL_PASSWORD` in `.env` |
| `/v1/*` blocked remotely | By default dashboard is local-only. Use `--host 0.0.0.0` with reverse proxy, configure `JWT_SECRET` / `API_KEY_SECRET` |
| SQLite native module missing | `better-sqlite3` is optional. `sql.js` (pure JS) is used as fallback automatically. On Node 22+, prebuilds work without build tools |
| Port already in use | `nzrouter` auto-kills previous processes. If stuck: `npx kill-port 20514` or restart terminal |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js 20+ (Bun supported) |
| **Framework** | Next.js 16, React 19, Tailwind CSS 4 |
| **Database** | SQLite (`bun:sqlite` → `better-sqlite3` → `node:sqlite` → `sql.js` fallback) |
| **Streaming** | Server-Sent Events (SSE) |
| **Auth** | OAuth 2.0 (PKCE) + JWT session cookies + HMAC API keys |
| **CLI** | Node.js, system tray (Windows: PowerShell NotifyIcon; macOS/Linux: `systray2` fork) |
| **Language** | Plain JavaScript (ESM), no TypeScript |

---

## 📁 Project Structure

```
NzRouter/
├── src/
│   ├── app/                    # Next.js App Router (API routes + dashboard pages)
│   │   ├── api/
│   │   │   ├── v1/             # OpenAI-compatible endpoints (/chat/completions, /models, etc.)
│   │   │   ├── v1beta/         # Beta compatibility endpoints
│   │   │   ├── providers/      # Provider CRUD, OAuth, testing
│   │   │   ├── combos/         # Model combo management
│   │   │   ├── keys/           # API key lifecycle
│   │   │   ├── usage/          # Usage analytics & logs
│   │   │   └── sync/           # Cloud sync
│   │   └── dashboard/          # Dashboard UI pages
│   ├── sse/                    # App-side SSE handlers (entry glue)
│   │   └── handlers/chat.js    # Request parse, combo handling, account selection
│   ├── lib/
│   │   ├── db/                 # SQLite persistence layer (repos, migrations, paths)
│   │   ├── localDb.js          # Backward-compat shim → @/lib/db
│   │   └── usageDb.js          # Usage stats + request logs
│   ├── shared/                 # Shared utilities, constants, schema
│   └── proxy.js                # Custom server for real client IP extraction
├── open-sse/                   # Provider-agnostic routing/translation engine
│   ├── handlers/chatCore.js    # Core orchestration (translation, executor, retry)
│   ├── executors/              # Per-provider upstream adapters
│   ├── translator/             # Format translation (request/response)
│   │   ├── request/            # Client → Provider translators
│   │   ├── response/           # Provider → Client translators
│   │   ├── schema/             # Shared format constants
│   │   └── index.js            # Translator registry (self-registering)
│   ├── providers/registry/     # Provider definitions (auto-generated index)
│   ├── services/               # Provider config, account fallback, model resolution
│   ├── utils/                  # Stream handling, usage extraction, proxy fetch
│   └── rtk/                    # Token saver pre-translate hooks
├── cli/                        # CLI launcher package (published as `nzrouter`)
│   ├── cli.js                  # Entry point
│   ├── src/cli/                # TUI, tray, terminal UI, commands
│   └── hooks/                  # postinstall: self-heal sqlite/tray runtimes
├── tests/                      # Vitest suite (independent ESM package)
│   ├── unit/                   # Unit tests
│   ├── translator/             # Translator golden tests
│   └── __baseline__/           # Regression verification scripts
├── docs/
│   └── ARCHITECTURE.md         # Full system architecture documentation
├── public/                     # Static assets, i18n literals
├── scripts/                    # Build/dev/migration scripts
├── custom-server.js            # Next standalone wrapper (real IP extraction)
├── next.config.mjs             # Next.js config (rewrites /v1/* → /api/v1/*)
├── .env.example                # Environment variable template
├── CHANGELOG.md                # Version history
└── LICENSE                     # MIT License
```

---

## 📄 License

**MIT** — see [LICENSE](LICENSE).

---

## 🔗 Links

| Link | Description |
|------|-------------|
| **Website** | <https://n4tzzofficial.my.id/nzrouter/> |
| **GitHub** | <https://github.com/N4tzzOfficial/NzRouter> |
| **npm** | <https://www.npmjs.com/package/nzrouter> |
| **Issues** | <https://github.com/N4tzzOfficial/NzRouter/issues> |
| **Author** | **N4tzzOfficial** |

---

<div align="center">

Built with ❤️ by **N4tzzOfficial**

[Website](https://n4tzzofficial.my.id/nzrouter/) · [GitHub](https://github.com/N4tzzOfficial/NzRouter) · [npm](https://www.npmjs.com/package/nzrouter) · [Issues](https://github.com/N4tzzOfficial/NzRouter/issues)

</div>