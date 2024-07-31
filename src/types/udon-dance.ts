import { Category, fetchAyaVideoIndex, SortBy, Video, VideoIndex } from "@/types/video";
import { pinyin } from 'pinyin-pro';

interface UdonDanceVideoIndex {
  time: string;
  groups: UdonDanceGroup;
}

interface UdonDanceGroup {
  contents: UdonDanceContent[];
}

interface UdonDanceContent {
  groupName: string,
  songInfos: UdonDanceSongInfo[] | null;
}

interface UdonDanceSongInfo {
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

interface UdonVideoFile {
  id: number;
  md5: string;
}

async function fetchUdonFiles(): Promise<UdonVideoFile[]> {
  const response = await fetch('https://api.udon.dance/Api/Songs/files', {
    cache: 'no-cache',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }
  return await response.json() as UdonVideoFile[];
}

function findMatchingAyaSong(udonFiles: UdonVideoFile[], udonSong: UdonDanceSongInfo, ayaIndex: VideoIndex): Video | null {
  const udonSongMd5 = udonFiles.find(file => file.id === udonSong.id)?.md5;
  if (!udonSongMd5) return null;
  let ayaSong = ayaIndex.categories.flatMap(category => category.entries).find(ayaSong => {
    return ayaSong.checksum === udonSongMd5;
  });
  return ayaSong || null;
}

async function convertToAyaIndex(udonIndex: UdonDanceVideoIndex): Promise<VideoIndex> {
  let ayaIndex = await fetchAyaVideoIndex();
  let udonFiles = await fetchUdonFiles();

  let categories = udonIndex.groups.contents.map(group => {
    let entries = group.songInfos?.map(song => {
      let ayaSong = findMatchingAyaSong(udonFiles, song, ayaIndex);
      return {
        id: song.id,
        title: song.name,
        category: 0,
        categoryName: group.groupName,
        titleSpell: pinyin(song.name, { pattern: 'first' }),
        volume: song.volume,
        start: song.start,
        end: song.end,
        flip: song.flip,
        originalUrl: ayaSong?.originalUrl ?? [],
        checksum: ayaSong?.checksum ?? null,
        _matchingAya: ayaSong,
        _fromUdon: true,
      } as Video;
    }) || [];
    return {
      title: group.groupName,
      entries: entries,
    } as Category;
  });

  // join all and distinct by id
  let allEntries = categories.flatMap(category => category.entries).reduce((acc: Video[], entry) => {
    if (!acc.find(e => e.id === entry.id)) {
      acc.push(entry);
    }
    return acc;
  }, []).sort((a, b) => a.title.localeCompare(b.title));

  return {
    updated_at: 114514,
    categories: [
      {
        title: 'All Songs',
        entries: allEntries,
      } as Category,
      ...categories,
    ],
    defaultSortBy: SortBy.TITLE_ASC,
  };
}

export async function fetchUdonVideoIndex(): Promise<VideoIndex> {
  const response = await fetch('https://api.udon.dance/Api/Songs/list', {
    cache: 'no-cache',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }

  let udonIndex = await response.json() as UdonDanceVideoIndex;
  return await convertToAyaIndex(udonIndex);
}
