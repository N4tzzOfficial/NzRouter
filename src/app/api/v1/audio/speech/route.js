import { handleTts } from "@/sse/handlers/tts.js";
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

/** POST /v1/audio/speech - OpenAI-compatible TTS endpoint */
export const POST = withApiKey(async (request) => {
  return await handleTts(request);
});
