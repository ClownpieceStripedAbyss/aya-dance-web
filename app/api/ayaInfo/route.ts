import fetchWithDefaults from "@/utils/service"

import { SortBy, VideoIndex } from "@/types/ayaInfo"
export const revalidate = 60
export async function GET() {
  const index = await fetchWithDefaults(
    "https://aya-dance-cf.kiva.moe/aya-api/v1/songs"
  )
  const VideoIndex: VideoIndex = {
    ...index,
    defaultSortBy: SortBy.ID_ASC,
  }
  return new Response(JSON.stringify(VideoIndex), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
