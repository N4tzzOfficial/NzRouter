import https from "https";
import pkg from "../../../../package.json" with { type: "json" };

const NPM_PACKAGE_NAME = "nzrouter";
const VERSION_CACHE_TTL_MS = 3600000; // cache npm latest lookup for 1h
const GITHUB_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours for GitHub check

// Survive hot reload; one cache per process
const versionCache = (global.__npmVersionCache ??= { value: null, fetchedAt: 0 });
const githubCache = (global.__githubVersionCache ??= { value: null, fetchedAt: 0 });

function compareVersions(a, b) {
  const pa = String(a || "").split(".").map((n) => parseInt(n, 10));
  const pb = String(b || "").split(".").map((n) => parseInt(n, 10));
  for (let i = 0; i < 3; i++) {
    const na = Number.isNaN(pa[i]) ? 0 : pa[i];
    const nb = Number.isNaN(pb[i]) ? 0 : pb[i];
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

// Fetch latest version from npm registry
function fetchLatestVersion() {
  return new Promise((resolve) => {
    const req = https.get(
      `https://registry.npmjs.org/${NPM_PACKAGE_NAME}/latest`,
      { timeout: 4000 },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            if (res.statusCode < 200 || res.statusCode >= 300) return resolve(null);
            resolve(JSON.parse(data).version || null);
          } catch {
            resolve(null);
          }
        });
        res.on("error", () => resolve(null));
      }
    );
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
  });
}

// Fetch latest version from GitHub releases
function fetchGitHubVersion() {
  return new Promise((resolve) => {
    const req = https.get(
      "https://api.github.com/repos/N4tzzOfficial/NzRouter/releases/latest",
      { timeout: 5000, headers: { 'User-Agent': 'NzRouter-Server' } },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            if (res.statusCode < 200 || res.statusCode >= 300) return resolve(null);
            const release = JSON.parse(data);
            if (release.tag_name) {
              resolve(String(release.tag_name).replace(/^v/, ""));
            } else {
              resolve(null);
            }
          } catch {
            resolve(null);
          }
        });
        res.on("error", () => resolve(null));
      }
    );
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
  });
}

async function getLatestVersionCached() {
  if (versionCache.value && Date.now() - versionCache.fetchedAt < VERSION_CACHE_TTL_MS) {
    return versionCache.value;
  }
  const latest = await fetchLatestVersion();
  if (latest) {
    versionCache.value = latest;
    versionCache.fetchedAt = Date.now();
  }
  return latest;
}

async function getGitHubVersionCached() {
  if (githubCache.value && Date.now() - githubCache.fetchedAt < GITHUB_CACHE_TTL_MS) {
    return githubCache.value;
  }
  const latest = await fetchGitHubVersion();
  if (latest) {
    githubCache.value = latest;
    githubCache.fetchedAt = Date.now();
  }
  return latest;
}

export async function GET() {
  // Check both npm and GitHub, use the newer one.
  // Each source already resolves failures to null; never let one rejection kill the check.
  let npmLatest = null;
  let githubLatest = null;
  try {
    [npmLatest, githubLatest] = await Promise.all([
      getLatestVersionCached().catch(() => null),
      getGitHubVersionCached().catch(() => null),
    ]);
  } catch {
    npmLatest = null;
    githubLatest = null;
  }

  const currentVersion = pkg.version;
  let latestVersion = currentVersion;

  if (npmLatest && compareVersions(npmLatest, latestVersion) > 0) {
    latestVersion = npmLatest;
  }
  if (githubLatest && compareVersions(githubLatest, latestVersion) > 0) {
    latestVersion = githubLatest;
  }

  const hasUpdate = compareVersions(latestVersion, currentVersion) > 0;

  return Response.json({ currentVersion, latestVersion, hasUpdate });
}
