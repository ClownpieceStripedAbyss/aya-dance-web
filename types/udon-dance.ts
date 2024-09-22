export interface UdonDanceSongInfo {
  id: number
  danceid: number
  name: string
  artist: string
  dancer: string
  playerCount: number
  volume: number
  start: number
  end: number
  flip: boolean
}

export interface VideoIndex {
  loading?: boolean
  updated_at: number
  categories: Category[]
  defaultSortBy: SortBy
}

export interface Category {
  title: string
  entries: Video[]
}

export interface Video {
  id: number
  title: string
  category: number
  categoryName: string
  titleSpell: string
  volume: number
  start: number
  end: number
  flip: boolean
  originalUrl: string[]
  checksum: string | null
  _fromUdon: UdonDanceSongInfo | null
  _matchingAya: Video | null
}

export enum SortBy {
  ID_ASC,
  ID_DESC,
  TITLE_ASC,
  TITLE_DESC,
}
