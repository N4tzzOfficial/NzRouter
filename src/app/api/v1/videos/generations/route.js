import { handleVideoCreate } from "@/sse/handlers/videoGeneration.js";
import { withApiKey } from "@/sse/middleware/requireApiKey.js";

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

/** POST /v1/videos/generations - async video generation (xAI Grok Imagine) */
export const POST = withApiKey(async (request) => {
  return await handleVideoCreate(request, "generations");
});
