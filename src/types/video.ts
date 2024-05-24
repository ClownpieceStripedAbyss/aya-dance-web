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

export const videoUrl = (video: Video) => `https://aya-dance-cf.kiva.moe/api/v1/videos/${video.id}.mp4`;
export const videoThumbnailUrl = (video: Video) => video.thumbnailUrl || '/unity-error.jpg';
