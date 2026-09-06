# Docker

Run N4tzzOfficial (NzRouter) in a container. Build the image yourself with the bundled `Dockerfile` (CI not yet wired) — the canonical source repo is at https://github.com/N4tzzOfficial/NzRouter and docs live at https://n4tzzofficial.my.id/nzrouter/.

---

# 👤 For Users

## Quick start

```bash
docker run -d \
  -p 20514:20514 \
  -v "$HOME/.nzrouter:/app/data" \
  -e DATA_DIR=/app/data \
  --name nzrouter \
  N4tzzOfficial/NzRouter:local
```

App listens on port `20514`. Open: http://localhost:20514

## Manage container

```bash
docker logs -f nzrouter        # view logs
docker stop nzrouter           # stop
docker start nzrouter          # start again
docker rm -f nzrouter          # remove
```

## Data persistence

```bash
-v "$HOME/.nzrouter:/app/data" \
-e DATA_DIR=/app/data
```

Without `DATA_DIR`, the app falls back to `~/.nzrouter/` (macOS/Linux) or `%APPDATA%\nzrouter\` (Windows). In the container, `DATA_DIR=/app/data` makes the bind mount work.

Data layout under `$DATA_DIR/`:

```text
$DATA_DIR/
├── db/
│   ├── data.sqlite       # main SQLite database
│   └── backups/          # auto backups
└── ...                   # certs, logs, runtime configs
```

Host path: `$HOME/.nzrouter/db/data.sqlite`
Container path: `/app/data/db/data.sqlite`

## Optional env vars

```bash
docker run -d \
  -p 20514:20514 \
  -v "$HOME/.nzrouter:/app/data" \
  -e DATA_DIR=/app/data \
  -e PORT=20514 \
  -e HOSTNAME=0.0.0.0 \
  -e DEBUG=true \
  --name nzrouter \
  N4tzzOfficial/NzRouter:local
```

## Optional Headroom sidecar

The NzRouter image does not bundle Python or Headroom. To use Headroom in Docker, run it as a separate service and point NzRouter at that proxy:

```yaml
services:
  nzrouter:
    image: N4tzzOfficial/NzRouter:local
    ports:
      - "20514:20514"
    volumes:
      - "$HOME/.nzrouter:/app/data"
    environment:
      DATA_DIR: /app/data
      HEADROOM_URL: http://headroom:8787
    depends_on:
      - headroom

  headroom:
    image: ghcr.io/chopratejas/headroom:latest
    ports:
      - "8787:8787"
```

In the dashboard, open `Endpoint` → `Token Saver` → `Headroom`, confirm the URL is `http://headroom:8787`, recheck status, then enable Headroom.

If Headroom runs on the Docker host instead of as a sidecar, use `http://host.docker.internal:8787` on macOS/Windows. On Linux, add `--add-host=host.docker.internal:host-gateway` or the equivalent compose `extra_hosts` entry.

## Update to latest

```bash
docker pull N4tzzOfficial/NzRouter:local
docker rm -f nzrouter
# re-run the quick start command
```

---

# 🛠 For Developers

## Build image locally (test)

```bash
docker build -t N4tzzOfficial/NzRouter:local .

docker run --rm -p 20514:20514 \
  -v "$HOME/.nzrouter:/app/data" \
  -e DATA_DIR=/app/data \
  N4tzzOfficial/NzRouter:local
```

## Publish (manual for now)

```bash
docker tag N4tzzOfficial/NzRouter:local ghcr.io/N4tzzOfficial/NzRouter:latest
docker push ghcr.io/N4tzzOfficial/NzRouter:latest
```

The Dockerfile lives at `./Dockerfile`. Workflow definition is at `.github/workflows/docker-publish.yml` (placeholder until CI is wired).
