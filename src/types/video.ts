export interface VideoIndex {
  updated_at: number,
  categories: Category[],
  defaultSortBy: SortBy,
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
  originalUrl: string[];
  _fromUdon: boolean | undefined;
}

export enum SortBy {
  ID_ASC,
  ID_DESC,
  TITLE_ASC,
  TITLE_DESC,
}

export const CAT_FAVOURITES = "喜欢的歌曲";
export const KEY_FAVOURITES = "favourites";
export const KEY_SELECTED_CATEGORY = "selectedCategory";

export async function fetchAyaVideoIndex(): Promise<VideoIndex> {
  const response = await fetch('https://aya-dance-cf.kiva.moe/aya-api/v1/songs', {
    cache: 'no-cache',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }

  let index = await response.json() as VideoIndex;
  return {
    ...index,
    defaultSortBy: SortBy.ID_ASC,
  } as VideoIndex;
}

export const videoUrl = (video: Video) => video._fromUdon
  ? `https://api.udon.dance/Api/Songs/play?id=${video.id}`
  : `https://aya-dance-cf.kiva.moe/api/v1/videos/${video.id}.mp4`;

export const videoThumbnailUrl = (video: Video) => {
  if (video.originalUrl.length > 0) {
    const youtube = video.originalUrl.find(url => url.includes('youtube.com'));
    if (youtube) {
      const videoId = youtube.split('v=')[1];
      return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    }
  }
  return "/unity-error.jpg";
}

export const videoMatchesQuery = (video: Video, query: string) => {
  const lowerQuery = query.toLowerCase();

  let kw = lowerQuery.split(' ');
  // vague search: if the query has no spaces
  let kwVague = lowerQuery.indexOf(' ') === -1
    ? Array.from(lowerQuery) // to array of characters
    : null;

  return (kwVague && VaguelyMatches(kwVague, video.titleSpell.toLowerCase()))
    || VaguelyMatches(kw, video.titleSpell.toLowerCase() || video.title)
    || IdMatches(lowerQuery, video.id)
    || (video._fromUdon && video.title === video.titleSpell && video.title.toLowerCase().includes(lowerQuery));
}

const IdMatches = (query: string, id: number) => {
  return query === id.toString() || id.toString().includes(query);
}

// invariant: kw and titleSpell are always lowercase
const VaguelyMatches = (kw: string[], titleSpell: string) => {
  if (kw.length === 0) return false;

  const spell = titleSpell.split(' ');
  if (kw.length > spell.length) return false;

  return spell.some((_, i) =>
    kw.every((keyword, j) =>
      spell[i + j]?.startsWith(keyword)),
  );

  // Equivalent UdonSharp code:
  // if (!kw || kw.length === 0) return false;
  //
  // const spell = titleSpell.split(' ');
  // if (kw.length > spell.length) return false;
  //
  // for (let i = 0; i < spell.length - kw.length + 1; i++) {
  //   let matches = true;
  //   for (let j = 0; j < kw.length; j++) {
  //     if (!spell[i + j].toLowerCase().startsWith(kw[j].toLowerCase())) {
  //       matches = false;
  //       break;
  //     }
  //   }
  //   if (matches) return true;
  // }
  //
  // return false;
}
