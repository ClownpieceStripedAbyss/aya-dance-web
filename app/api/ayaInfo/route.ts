// Cloudflare needs it, see: https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
export const runtime = 'edge';

import { fetchAyaInfo } from "@/types/ayaInfo";

export const revalidate = 60;

export async function GET() {
  const VideoIndex = await fetchAyaInfo();

  return new Response(JSON.stringify(VideoIndex), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
