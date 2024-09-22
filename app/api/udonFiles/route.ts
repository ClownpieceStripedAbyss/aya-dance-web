// Cloudflare needs it, see: https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
export const runtime = 'edge';

import { fetchUdonFiles, UdonVideoFile } from "@/types/udonInfo";

export const revalidate = 60;

export async function GET() {
  const data: UdonVideoFile[] = await fetchUdonFiles();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
