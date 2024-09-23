import fetchWithDefaults from "@/utils/service";
import { SortBy } from "@/types/video";

export interface AyaVideoIndex {
  updated_at: number;
  categories: AyaCategory[];
  defaultSortBy: SortBy;
  loading?: boolean;
}

export interface AyaCategory {
  title: string;
  entries: AyaVideo[];
}

export interface AyaVideo {
  id: number;
  category: number;
  title: string;
  categoryName: string;
  titleSpell: string;
  volume: number;
  start: number;
  end: number;
  flip: boolean;
  originalUrl: string[] | null;
  checksum: string | null;
}

export async function fetchAyaInfo(): Promise<AyaVideoIndex> {
  const index = await fetchWithDefaults(
    "https://aya-dance-cf.kiva.moe/aya-api/v1/songs"
  );

  return {
    ...index,
    defaultSortBy: SortBy.ID_ASC
  } as AyaVideoIndex;
}
