import { fetchWannaSongs, WannaData } from "@/types/video"

// Cloudflare needs it, see: https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
export const runtime = "nodejs"
export const dynamic = "force-static"
export const dynamicParams = false

export const revalidate = 60

export async function GET() {
  const data: WannaData[] = await fetchWannaSongs()

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
