import fetchWithDefaults from "@/service/index"

import { VideoIndex, SortBy } from "@/types/udon-dance"

export async function fetchAyaVideoIndex(): Promise<VideoIndex> {
  const indexs: VideoIndex = await fetchWithDefaults(
    "https://aya-dance-cf.kiva.moe/aya-api/v1/songs",
    {
      cache: "no-cache",
    }
  )

  return {
    ...indexs,
    defaultSortBy: SortBy.ID_ASC,
  }
}
