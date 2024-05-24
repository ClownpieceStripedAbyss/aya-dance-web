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

export const videoMatchesQuery = (video: Video, query: string) => {
  const lowerQuery = query.toLowerCase();
  let kw = lowerQuery.split(' '); // Split the search query by spaces
  let kwVague: string[] | null = null;
  if (lowerQuery.indexOf(' ') === -1) {
    // Convert each character into an element of an array
    kwVague = Array.from(lowerQuery);
  }

  return (kwVague && VaguelyMatches(kwVague, video.titleSpell))
    || WordMatches(kw, video.title);
}

const VaguelyMatches = (kw: string[], titleSpell: string) => {
  if (kw.length === 0) return false;

  const spell = titleSpell.split(' ');
  if (kw.length > spell.length) return false;

  return spell.some((_, i) =>
    kw.every((keyword, j) => spell[i + j]?.toLowerCase().startsWith(keyword.toLowerCase())),
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

const WordMatches = (kw: string[], text: string) => {
  return kw.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
  // Equivalent UdonSharp code:
  // for (const k of kw)
  //   if (text.toLowerCase().includes(k.toLowerCase()))
  //     return true;
  // return false;
}
