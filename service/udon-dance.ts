import { VideoIndex, SortBy } from "@/types/udon-dance"

export async function fetchAyaVideoIndex(): Promise<VideoIndex> {
  const response = await fetch(
    "https://aya-dance-cf.kiva.moe/aya-api/v1/songs",
    {
      cache: "no-cache",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch videos")
  }

  let index = (await response.json()) as VideoIndex
  return {
    ...index,
    defaultSortBy: SortBy.ID_ASC,
  } as VideoIndex
}
