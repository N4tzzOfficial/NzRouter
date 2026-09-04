// Bare `/v1` (and the `/api/v1` rewrite target) is an alias for
// `/v1/models` — see ./models/route.js for the GET implementation. Re-export
// the GET and OPTIONS through the API-key middleware so an unauthenticated
// caller is either allowlisted (the public model catalog is allowlisted
// because the dashboard fetches it before login) or rejected with the
// canonical 401 message. Without this wrap, a bare `curl /v1` would skip
// the middleware entirely and leak the model catalog regardless of
// `UNAUTHED_ALLOWLIST` contents.
import { GET as ModelsGET, OPTIONS as ModelsOPTIONS } from "./models/route.js";
import { withApiKey } from "@/sse/middleware/requireApiKey.js";

export const GET = withApiKey(ModelsGET);
export const OPTIONS = ModelsOPTIONS;
