import fetchWithDefaults from "@/service/index"

import { VideoIndex, SortBy } from "@/types/udon-dance"

export async function fetchAyaVideoIndex(): Promise<VideoIndex> {
  const res: VideoIndex = await fetchWithDefaults(
    "https://aya-dance-cf.kiva.moe/aya-api/v1/songs"
  )

  return new Promise((resolve) => {
    resolve({
      ...res,
      defaultSortBy: SortBy.ID_ASC,
    })
  })
}
