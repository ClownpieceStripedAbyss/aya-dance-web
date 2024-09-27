import fetchWithDefaults from "@/utils/service"

export interface GenericVideoGroup {
  title: string
  entries: GenericVideo[]
  major: string | ""
}

export interface GenericVideo {
  id: number
  ayaId: number | null
  name: string
  artist: string
  dancer: string
  playerCount: number
  composedTitle: string
  composedTitleSpell: string
  group: string
  genre: string
  volume: number
  start: number
  end: number
  flip: boolean
  tag: string[] | null
  doubleWidth: boolean
  originalUrl: string[]
  checksum: string | null
}

export interface WannaData {
  code: number
  data: {
    time: string
    groups: GenericVideoGroup[]
  }
}

export enum SortBy {
  ID_ASC,
  ID_DESC,
  TITLE_ASC,
  TITLE_DESC,
}

export const formatTag = (tag: string | undefined) => {
  switch (tag) {
    case "combined-video":
      return "复合"
    case "new":
      return "新歌"
    default:
      return tag
  }
}

export const formatTagColor = (
  tag: string | undefined
): "danger" | "primary" | undefined => {
  switch (tag) {
    case "combined-video":
      return "danger"
    case "new":
      return "primary"
    default:
      return undefined
  }
}

export const formatGenreColor = (genre: string): string | undefined => {
  if (genre.includes("K-POP") || genre.includes("KPOP")) {
    return "text-danger"
  }
  if (genre.includes("ACGN")) {
    return "text-primary"
  }
  return undefined
}

export async function fetchWannaSongs(): Promise<WannaData[]> {
  return await fetchWithDefaults("https://x.kiva.moe/api/wanna/songs")
}
