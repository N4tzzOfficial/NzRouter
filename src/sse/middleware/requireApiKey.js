/**
 * Mandatory API key enforcement for all /v1/* endpoints.
 *
 * NzRouter is a public-facing proxy — every upstream request must carry a
 * valid `x-api-key` (or `Authorization: Bearer …`) header. Without it we
 * return 401 with the canonical "Wow, you idiot" message that the dashboard
 * and CLI tooling expect to see when the user forgot to attach a key.
 *
 * Routes that opt out (the dashboard auth endpoints, OAuth callbacks, the
 * `/api/v1/models` and `/api/v1/videos/:id` lookup endpoints that act as
 * status checkers, etc.) list themselves in `UNAUTHED_ALLOWLIST`. Keeping
 * the allowlist explicit beats a long deny-list — every new route gets the
 * safe default of "needs a key".
 */
import { errorResponse } from "open-sse/utils/error.js";
import { HTTP_STATUS } from "open-sse/config/runtimeConfig.js";
import {
  extractApiKey,
  isValidApiKey,
} from "@/sse/services/auth.js";

const NO_KEY_MESSAGE =
  "Wow, you idiot, the NzRouter won't work without the API KEY, you idiot";
const BAD_KEY_MESSAGE =
  "Wow, you idiot, the API KEY you sent is wrong. Check the dashboard Endpoint & Key page, you idiot";

/**
 * Routes that are deliberately keyless (status, public health probes, etc.).
 * Keep this list short — every entry must justify why an unauthenticated
 * caller should reach the route.
 *
 * IMPORTANT: The `/v1/*` endpoints (including `/v1/models` and bare `/v1`) are
 * NOT in this list. Every `/v1/*` path requires a valid API key, including
 * the model catalog. The dashboard reads the model list from a separate
 * session-cookie-authenticated internal route (`/api/internal/models`) before
 * the user has set up a key; once a key exists, the dashboard uses the
 * `/v1/models` endpoint with the key in the `x-api-key` header.
 *
 * Both the public-rewrite form (`/v1/...`) and the internal route form
 * (`/api/v1/...`) are checked — Next.js rewrites `/v1` → `/api/v1`, but the
 * `request.url` passed into route handlers still carries the ORIGINAL path
 * the client hit, so the middleware sees `/v1/...` even though the handler
 * file lives under `/api/v1/...`.
 */
const UNAUTHED_ALLOWLIST = new Set([
  // Intentionally empty — no `/v1/*` route is allowlisted. The model catalog,
  // chat completions, embeddings, and every other LLM endpoint all require a
  // valid API key.
]);

/**
 * Decide whether a path should be key-protected.
 * Matches `/api/v1/*` and the public `/v1/*` rewrite target.
 */
function isV1Path(pathname) {
  return (
    pathname === "/v1" ||
    pathname.startsWith("/v1/") ||
    pathname === "/api/v1" ||
    pathname.startsWith("/api/v1/")
  );
}

/**
 * Wrap a Next.js route handler with mandatory API-key enforcement.
 *
 * Usage:
 *   import { withApiKey } from "@/sse/middleware/requireApiKey.js";
 *   export const POST = withApiKey(async (request, ctx, apiKey) => { … });
 */
export function withApiKey(handler) {
  return async function apiKeyWrapped(request, ctx) {
    const url = new URL(request.url);
    if (!isV1Path(url.pathname)) {
      return handler(request, ctx, null);
    }
    if (UNAUTHED_ALLOWLIST.has(url.pathname)) {
      return handler(request, ctx, extractApiKey(request));
    }

    const apiKey = extractApiKey(request);
    if (!apiKey) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, NO_KEY_MESSAGE);
    }
    const valid = await isValidApiKey(apiKey);
    if (!valid) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, BAD_KEY_MESSAGE);
    }
    return handler(request, ctx, apiKey);
  };
}

/**
 * Standalone guard — returns a Response if the request is unauthorised,
 * or `null` if it should be allowed through.
 */
export async function guardApiKey(request) {
  const url = new URL(request.url);
  if (!isV1Path(url.pathname)) return null;
  if (UNAUTHED_ALLOWLIST.has(url.pathname)) return null;

  const apiKey = extractApiKey(request);
  if (!apiKey) {
    return errorResponse(HTTP_STATUS.UNAUTHORIZED, NO_KEY_MESSAGE);
  }
  const valid = await isValidApiKey(apiKey);
  if (!valid) {
    return errorResponse(HTTP_STATUS.UNAUTHORIZED, BAD_KEY_MESSAGE);
  }
  return null;
}

export { NO_KEY_MESSAGE, BAD_KEY_MESSAGE };
