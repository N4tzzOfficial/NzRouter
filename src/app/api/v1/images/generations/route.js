import { handleImageGeneration } from "@/sse/handlers/imageGeneration.js";
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

/** POST /v1/images/generations - OpenAI-compatible image generation endpoint */
export const POST = withApiKey(async (request) => {
  return await handleImageGeneration(request);
});
