export interface GenericVideoGroup {
  title: string;
  entries: GenericVideo[];
  major: string | "";
}

export interface GenericVideo {
  id: number;
  ayaId: number | null;
  name: string;
  artist: string;
  dancer: string;
  playerCount: number;
  composedTitle: string;
  composedTitleSpell: string;
  volume: number;
  start: number;
  end: number;
  flip: boolean;
  tag: string[] | null;
  doubleWidth: boolean;
  originalUrl: string[];
  checksum: string | null;
}

export enum SortBy {
  ID_ASC,
  ID_DESC,
  TITLE_ASC,
  TITLE_DESC,
}
