const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

/**
 * Background executor that performs git pull, npm install, build, and restart
 * when a new version is detected from GitHub.
 */
class BackgroundExecutor {
  constructor(options = {}) {
    this.repoPath = options.repoPath || this.findRepoPath();
    this.isRunning = false;
    this.lastCheck = 0;
    this.checkInterval = null;
  }

  /**
   * Find the repository root path
   */
  findRepoPath() {
    // In development: cli.js is at project root
    // In production: cli.js is at ~/.nzrouter/runtime/node_modules/nzrouter/cli.js
    // The repo is at the parent of the cli package
    const candidates = [
      path.join(__dirname, "..", ".."), // from cli/src/lib to repo root
      path.join(process.cwd(), ".."),   // from cwd
      process.env.NZROUTER_REPO_PATH,
    ].filter(Boolean);

    for (const candidate of candidates) {
      if (fs.existsSync(path.join(candidate, ".git"))) {
        return candidate;
      }
    }
    return process.cwd();
  }

  /**
   * Check if we're in a git repository
   */
  isGitRepo() {
    return fs.existsSync(path.join(this.repoPath, ".git"));
  }

  /**
   * Get current git commit hash
   */
  getCurrentCommit() {
    try {
      return execSync("git rev-parse HEAD", {
        cwd: this.repoPath,
        encoding: "utf8",
        windowsHide: true,
      }).trim();
    } catch {
      return null;
    }
  }

  /**
   * Check if there are uncommitted changes
   */
  hasUncommittedChanges() {
    try {
      const status = execSync("git status --porcelain", {
        cwd: this.repoPath,
        encoding: "utf8",
        windowsHide: true,
      }).trim();
      return status.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Perform git pull
   */
  async gitPull() {
    console.log("[BackgroundExecutor] Pulling latest changes from GitHub...");
    try {
      // Fetch first
      execSync("git fetch origin", {
        cwd: this.repoPath,
        encoding: "utf8",
        windowsHide: true,
        timeout: 60000,
      });

      // Get current branch
      const branch = execSync("git rev-parse --abbrev-ref HEAD", {
        cwd: this.repoPath,
        encoding: "utf8",
        windowsHide: true,
      }).trim();

      // Pull with rebase to avoid merge commits
      execSync(`git pull --rebase origin ${branch}`, {
        cwd: this.repoPath,
        encoding: "utf8",
        windowsHide: true,
        timeout: 60000,
      });

      console.log("[BackgroundExecutor] Git pull completed");
      return true;
    } catch (error) {
      console.error("[BackgroundExecutor] Git pull failed:", error.message);
      return false;
    }
  }

  /**
   * Run npm install
   */
  async npmInstall() {
    console.log("[BackgroundExecutor] Running npm install...");
    try {
      // Install root dependencies
      execSync("npm install", {
        cwd: this.repoPath,
        encoding: "utf8",
        windowsHide: true,
        timeout: 180000,
        stdio: "pipe",
      });

      // Install CLI dependencies
      const cliPath = path.join(this.repoPath, "cli");
      if (fs.existsSync(path.join(cliPath, "package.json"))) {
        execSync("npm install", {
          cwd: cliPath,
          encoding: "utf8",
          windowsHide: true,
          timeout: 120000,
          stdio: "pipe",
        });
      }

      console.log("[BackgroundExecutor] npm install completed");
      return true;
    } catch (error) {
      console.error("[BackgroundExecutor] npm install failed:", error.message);
      return false;
    }
  }

  /**
   * Run build
   */
  async build() {
    console.log("[BackgroundExecutor] Building project...");
    try {
      // Build the main app
      execSync("npm run build", {
        cwd: this.repoPath,
        encoding: "utf8",
        windowsHide: true,
        timeout: 300000,
        stdio: "pipe",
      });

      // Build CLI package
      const cliPath = path.join(this.repoPath, "cli");
      if (fs.existsSync(path.join(cliPath, "package.json"))) {
        execSync("npm run build", {
          cwd: cliPath,
          encoding: "utf8",
          windowsHide: true,
          timeout: 180000,
          stdio: "pipe",
        });
      }

      console.log("[BackgroundExecutor] Build completed");
      return true;
    } catch (error) {
      console.error("[BackgroundExecutor] Build failed:", error.message);
      return false;
    }
  }

  /**
   * Restart the server by sending SIGTERM to the main process
   * The CLI's process manager will handle the restart
   */
  async restartServer() {
    console.log("[BackgroundExecutor] Restarting server...");

    // Find the main server process (the one that started the background executor)
    // In CLI mode, we signal the parent process
    if (process.ppid) {
      try {
        process.kill(process.ppid, "SIGTERM");
        console.log("[BackgroundExecutor] Sent SIGTERM to parent process");
      } catch (e) {
        console.error("[BackgroundExecutor] Failed to signal parent:", e.message);
      }
    }

    // Also try to kill any nzrouter processes on the app port
    try {
      // Import dynamically to avoid circular dependency
      const cliModule = require("../cli.js");
      if (cliModule.killAllAppProcesses) {
        await cliModule.killAllAppProcesses(20514);
      }
    } catch (e) {
      // Ignore
    }

    return true;
  }

  /**
   * Execute the full update cycle: git pull -> npm install -> build -> restart
   */
  async executeUpdate() {
    if (this.isRunning) {
      console.log("[BackgroundExecutor] Update already in progress, skipping");
      return false;
    }

    if (!this.isGitRepo()) {
      console.log("[BackgroundExecutor] Not a git repository, skipping update");
      return false;
    }

    // Check for uncommitted changes
    if (this.hasUncommittedChanges()) {
      console.log("[BackgroundExecutor] Uncommitted changes detected, skipping update");
      return false;
    }

    const currentCommit = this.getCurrentCommit();
    console.log(`[BackgroundExecutor] Current commit: ${currentCommit}`);

    this.isRunning = true;

    try {
      // Step 1: Git pull
      const pullSuccess = await this.gitPull();
      if (!pullSuccess) throw new Error("Git pull failed");

      // Check if anything actually changed
      const newCommit = this.getCurrentCommit();
      if (newCommit === currentCommit) {
        console.log("[BackgroundExecutor] No new commits, skipping build");
        return false;
      }

      console.log(`[BackgroundExecutor] New commit: ${newCommit}`);

      // Step 2: npm install
      const installSuccess = await this.npmInstall();
      if (!installSuccess) throw new Error("npm install failed");

      // Step 3: Build
      const buildSuccess = await this.build();
      if (!buildSuccess) throw new Error("Build failed");

      // Step 4: Restart
      await this.restartServer();

      console.log("[BackgroundExecutor] Update cycle completed successfully");
      return true;
    } catch (error) {
      console.error("[BackgroundExecutor] Update failed:", error.message);
      return false;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Start the background check loop (every 6 hours)
   */
  start(intervalMs = 6 * 60 * 60 * 1000) {
    if (this.checkInterval) return;

    // Initial check after 30 seconds
    setTimeout(() => {
      this.checkAndExecute();
    }, 30000);

    // Then every 6 hours
    this.checkInterval = setInterval(() => {
      this.checkAndExecute();
    }, intervalMs);

    // Prevent interval from keeping process alive
    this.checkInterval.unref();
  }

  /**
   * Stop the background check loop
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Check for updates and execute if available
   */
  async checkAndExecute() {
    const now = Date.now();
    if (now - this.lastCheck < 60000) return; // Don't check more than once per minute
    this.lastCheck = now;

    // Check if there's a newer version on GitHub
    const hasUpdate = await this.checkGitHubUpdate();
    if (hasUpdate) {
      console.log("[BackgroundExecutor] New version detected, starting update...");
      await this.executeUpdate();
    }
  }

  /**
   * Check GitHub for latest release
   */
  async checkGitHubUpdate() {
    const https = require("https");
    return new Promise((resolve) => {
      const req = https.get("https://api.github.com/repos/N4tzzOfficial/NzRouter/releases/latest", {
        timeout: 5000,
        headers: { 'User-Agent': 'NzRouter-BackgroundExecutor' }
      }, (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => {
          try {
            const release = JSON.parse(data);
            if (release.tag_name) {
              const latestVersion = release.tag_name.replace('v', '');
              const currentVersion = this.getCurrentVersion();
              if (this.compareVersions(latestVersion, currentVersion) > 0) {
                resolve(true);
                return;
              }
            }
            resolve(false);
          } catch {
            resolve(false);
          }
        });
      });
      req.on("error", () => resolve(false));
      req.on("timeout", () => { req.destroy(); resolve(false); });
    });
  }

  /**
   * Get current version from package.json
   */
  getCurrentVersion() {
    try {
      const pkgPath = path.join(this.repoPath, "package.json");
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      return pkg.version;
    } catch {
      return "0.0.0";
    }
  }

  /**
   * Compare semver versions
   */
  compareVersions(a, b) {
    const pa = a.split(".").map(Number);
    const pb = b.split(".").map(Number);
    for (let i = 0; i < 3; i++) {
      if (pa[i] > pb[i]) return 1;
      if (pa[i] < pb[i]) return -1;
    }
    return 0;
  }
}

let executorInstance = null;

function getBackgroundExecutor(options) {
  if (!executorInstance) {
    executorInstance = new BackgroundExecutor(options);
  }
  return executorInstance;
}

function startBackgroundExecutor(options) {
  const executor = getBackgroundExecutor(options);
  executor.start();
  return executor;
}

function stopBackgroundExecutor() {
  if (executorInstance) {
    executorInstance.stop();
  }
}

module.exports = {
  BackgroundExecutor,
  getBackgroundExecutor,
  startBackgroundExecutor,
  stopBackgroundExecutor,
};