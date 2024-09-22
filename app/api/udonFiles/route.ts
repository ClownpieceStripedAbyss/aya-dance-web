import { UdonVideoFile } from "@/types/udonInfo"
import fetchWithDefaults from "@/utils/service"

export const revalidate = 60
export async function GET() {
  const data: UdonVideoFile = await fetchWithDefaults(
    "https://api.udon.dance/Api/Songs/files"
  )

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
