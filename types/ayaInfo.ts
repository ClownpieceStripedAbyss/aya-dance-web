export interface VideoIndex {
  updated_at: number;
  categories: Category[];
  defaultSortBy: SortBy;
  loading?: boolean;
}

export interface Category {
  title: string;
  entries: Video[];
}

export interface Video {
  id: number;
  ayaId?: number;
  title: string;
  artist: string;
  dancer: string;
  category: number;
  categoryName: string;
  titleSpell: string;
  volume: number;
  start: number;
  end: number;
  flip: boolean;
  originalUrl: string[];
  checksum: string | null;
  _fromUdon?: UdonDanceUdonInfo | null;
  _matchingAya?: Video | null;
}

export enum SortBy {
  ID_ASC,
  ID_DESC,
  TITLE_ASC,
  TITLE_DESC,
}

export interface UdonDanceUdonInfo {
  id: number;
  danceid: number;
  name: string;
  artist: string;
  dancer: string;
  playerCount: number;
  volume: number;
  start: number;
  end: number;
  flip: boolean;
}
