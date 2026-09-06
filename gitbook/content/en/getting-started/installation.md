# Installation

Detailed installation guide for N4tzzOfficial with troubleshooting tips.

---

## Requirements

### System Requirements

- **Node.js**: Version 20.0.0 or higher
- **npm**: Version 10.0.0 or higher (comes with Node.js)
- **OS**: macOS, Linux, Windows (WSL recommended)
- **Disk Space**: ~200MB for installation

### Check Your Version

```bash
node --version
# Should show v20.x.x or higher

npm --version
# Should show 10.x.x or higher
```

**Don't have Node.js?** Install from [nodejs.org](https://nodejs.org/)

---

## Installation Methods

### Method 1: Global Installation (Recommended)

Install N4tzzOfficial globally to use from anywhere:

```bash
npm install -g N4tzzOfficial
```

**Start N4tzzOfficial:**

```bash
N4tzzOfficial
```

**Benefits:**
- ✅ Run from any directory
- ✅ Simple command: `N4tzzOfficial`
- ✅ Auto-updates with `npm update -g N4tzzOfficial`

### Method 2: Local Installation

Install in a specific project:

```bash
mkdir my-N4tzzOfficial
cd my-N4tzzOfficial
npm install N4tzzOfficial
```

**Start N4tzzOfficial:**

```bash
npx N4tzzOfficial
```

**Benefits:**
- ✅ Isolated per project
- ✅ Version control per project
- ✅ No global namespace pollution

### Method 3: From Source (Development)

Clone and build from GitHub:

```bash
git clone https://github.com/N4tzzOfficial/N4tzzOfficial.git
cd N4tzzOfficial/app
npm install
npm run build
npm start
```

**Benefits:**
- ✅ Latest development features
- ✅ Contribute to development
- ✅ Custom modifications

---

## First Run

### Start the Server

```bash
N4tzzOfficial
```

**What happens:**
1. Server starts on `http://localhost:20128`
2. Dashboard opens automatically in browser
3. Data directory created at `~/.N4tzzOfficial`
4. API key generated automatically

### Dashboard Login

**Default credentials:**
- Password: `123456`

**⚠️ Change password immediately:**
1. Login to dashboard
2. Settings → Change Password
3. Use strong password

### Get Your API Key

```
Dashboard → Settings → API Keys
→ Copy your API key
→ Use in CLI tools
```

**Example API key format:**
```
9r_1234567890abcdef1234567890abcdef
```

---

## Verify Installation

### Check Server Status

```bash
curl http://localhost:20128/health
```

**Expected response:**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

### List Available Models

```bash
curl http://localhost:20128/v1/models \
  -H "Authorization: Bearer your-api-key"
```

**Expected response:**
```json
{
  "object": "list",
  "data": [
    {
      "id": "cc/claude-opus-4-5-20251101",
      "object": "model",
      "created": 1234567890,
      "owned_by": "claude-code"
    }
  ]
}
```

### Test Chat Completion

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "cc/claude-opus-4-5-20251101",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

---

## Configuration

### Environment Variables

Create `.env` file or set environment variables:

```bash
# Security (REQUIRED in production)
export JWT_SECRET="your-secure-secret-change-this"
export INITIAL_PASSWORD="your-password"

# Storage
export DATA_DIR="~/.N4tzzOfficial"

# Server
export PORT="20128"
export NODE_ENV="production"

# Logging
export ENABLE_REQUEST_LOGS="false"
```

### Data Directory

**Default location:** `~/.N4tzzOfficial`

**Contents:**
```
~/.N4tzzOfficial/
  ├── db.json           # Database (providers, combos, usage)
  ├── api-keys.json     # API keys
  └── logs/             # Request logs (if enabled)
```

**Change location:**

```bash
export DATA_DIR="/custom/path"
N4tzzOfficial
```

### Port Configuration

**Default port:** `20128`

**Change port:**

```bash
export PORT="3000"
N4tzzOfficial
```

**Or use command line:**

```bash
N4tzzOfficial --port 3000
```

---

## Troubleshooting

### Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::20128
```

**Solution 1: Kill existing process**

```bash
# Find process using port 20128
lsof -i :20128

# Kill process
kill -9 <PID>
```

**Solution 2: Use different port**

```bash
N4tzzOfficial --port 3000
```

### Permission Denied

**Error:**
```
Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/N4tzzOfficial'
```

**Solution: Use sudo (not recommended) or fix npm permissions**

```bash
# Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then install again
npm install -g N4tzzOfficial
```

### Node.js Version Too Old

**Error:**
```
Error: The engine "node" is incompatible with this module
```

**Solution: Update Node.js**

```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Or download from nodejs.org
```

### Dashboard Not Opening

**Issue:** Dashboard doesn't open automatically

**Solution 1: Open manually**

```
http://localhost:20128
```

**Solution 2: Check firewall**

```bash
# macOS: Allow Node.js in System Preferences → Security
# Linux: Check iptables
# Windows: Check Windows Firewall
```

### Cannot Connect to Providers

**Issue:** OAuth login fails or API key invalid

**Solution 1: Check internet connection**

```bash
ping google.com
```

**Solution 2: Check provider status**

- Claude Code: [status.anthropic.com](https://status.anthropic.com)
- OpenAI: [status.openai.com](https://status.openai.com)
- Gemini: [status.cloud.google.com](https://status.cloud.google.com)

**Solution 3: Regenerate API key**

```
Dashboard → Provider → Disconnect → Reconnect
```

### High Memory Usage

**Issue:** N4tzzOfficial using too much RAM

**Solution: Restart server**

```bash
# Stop
pkill -f N4tzzOfficial

# Start
N4tzzOfficial
```

**Or use PM2 for auto-restart:**

```bash
npm install -g pm2
pm2 start N4tzzOfficial --name N4tzzOfficial
pm2 save
```

---

## Deployment Options

### Local Development

```bash
npm install -g N4tzzOfficial
N4tzzOfficial
```

**Use case:** Personal coding, testing

### VPS/Cloud Server

```bash
# Install
npm install -g N4tzzOfficial

# Configure
export JWT_SECRET="your-secure-secret"
export INITIAL_PASSWORD="your-password"
export NODE_ENV="production"

# Start with PM2
npm install -g pm2
pm2 start N4tzzOfficial --name N4tzzOfficial
pm2 save
pm2 startup
```

**Use case:** Team access, remote coding

### Docker

```bash
docker pull N4tzzOfficial/N4tzzOfficial:latest

docker run -d \
  -p 20128:20128 \
  -e JWT_SECRET="your-secure-secret" \
  -e INITIAL_PASSWORD="your-password" \
  -v N4tzzOfficial-data:/root/.N4tzzOfficial \
  --name N4tzzOfficial \
  N4tzzOfficial/N4tzzOfficial:latest
```

**Use case:** Containerized deployment, Kubernetes

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:20128;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        
        # SSE support for streaming
        proxy_buffering off;
        proxy_read_timeout 86400;
    }
}
```

**Use case:** HTTPS, custom domain, load balancing

---

## Uninstallation

### Remove Global Installation

```bash
npm uninstall -g N4tzzOfficial
```

### Remove Data Directory

```bash
rm -rf ~/.N4tzzOfficial
```

### Remove Configuration

```bash
# Remove environment variables from shell config
nano ~/.bashrc  # or ~/.zshrc
# Delete N4tzzOfficial-related exports
```

---

## Next Steps

- [Getting Started Guide](../getting-started.md) - Connect providers and start coding
- [Features](../features/) - Explore quota tracking, combos, deployment
- [Troubleshooting](../troubleshooting.md) - Fix common issues

---

## Need Help?

- **Website**: [n4tzz.com](https://n4tzz.com)
- **GitHub**: [github.com/N4tzzOfficial/N4tzzOfficial](https://github.com/N4tzzOfficial/N4tzzOfficial)
- **Issues**: [github.com/N4tzzOfficial/N4tzzOfficial/issues](https://github.com/N4tzzOfficial/N4tzzOfficial/issues)


