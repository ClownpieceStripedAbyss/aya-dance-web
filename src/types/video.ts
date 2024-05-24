export interface VideoIndex {
  updated_at: number,
  categories: Category[],
}

export interface Category {
  title: string,
  entries: Video[],
}

export interface Video {
  id: number;
  title: string;
  category: number;
  categoryName: string;
  titleSpell: string;
  volume: number;
  start: number;
  end: number;
  flip: boolean;
  thumbnailUrl: string;
}
