// Cloudflare needs it, see: https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
export const runtime = "edge";

import { fetchUdonInfo } from "@/types/udonInfo";

export const revalidate = 60;

export async function GET() {
  const UdonInfo = await fetchUdonInfo();

  return new Response(JSON.stringify(UdonInfo), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
