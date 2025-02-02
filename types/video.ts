import fetchWithDefaults from "@/utils/service";
import { CustomPlayListState } from "@/store/modules/customPlaylist";
import { SetLockedRandomGroupPayload } from "@/store/modules/playOptions";

export const GROUP_FAVORITE = "Favorites"
export const GROUP_ALL_SONGS = "All Songs"
export const GROUP_CREATE_CUSTOM = "Create Custom Playlist" // TODO: remove it

export const BUILTIN_GROUP_NAMES = [GROUP_FAVORITE, GROUP_ALL_SONGS, GROUP_CREATE_CUSTOM]
export const isBuiltinGroup = (name: string) => BUILTIN_GROUP_NAMES.includes(name)

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
  NATURAL_ORDER,
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

export const allSongsFromGroups = (
  songTypes: GenericVideoGroup[]
): GenericVideo[] => {
  return songTypes.find((item) => item.title === GROUP_ALL_SONGS)?.entries || []
}

export const findSongById = (
  songTypes: GenericVideoGroup[],
  id: number
): GenericVideo | null => {
  const allSongs = allSongsFromGroups(songTypes)
  return allSongs.find((item) => item.id === id) || null
}

export const findSongEntries = (
  songTypes: GenericVideoGroup[],
  groupName: string,
  isCustomPlaylist: boolean,
  favoriteIds: number[],
  customList: CustomPlayListState
) : GenericVideo[] => {
  if (isCustomPlaylist) {
    const allSongs = allSongsFromGroups(songTypes);
    const playList = customList.content.find(x => x.name === groupName) || { danceIds: [] };
    const songsMap = new Map(allSongs.map((song) => [song.id, song]));
    return playList.danceIds.map(id => songsMap.get(id)).filter((x): x is GenericVideo => !!x);
  } else if (groupName === GROUP_FAVORITE) {
    const allSongs = allSongsFromGroups(songTypes);
    return allSongs.filter(x => favoriteIds.includes(x.id));
  } else {
    return songTypes.find(x => x.title === groupName)?.entries || [];
  }
}

export const computeNextQueueCandidates = (
  songTypes: GenericVideoGroup[],
  favoriteIds: number[],
  customList: CustomPlayListState,
  lockedRandomGroup: SetLockedRandomGroupPayload | null,
) => {
  const computeAllSongs = () => findSongEntries(songTypes, GROUP_ALL_SONGS, false, favoriteIds, customList);
  if (lockedRandomGroup) {
    const lockedRandomEntries = findSongEntries(songTypes, lockedRandomGroup.group, lockedRandomGroup.isCustom, favoriteIds, customList);
    return lockedRandomEntries.length > 0
      ? lockedRandomEntries
      : computeAllSongs();
  } else {
    return computeAllSongs();
  }
}

export default function videosQuery(
  videos: GenericVideo[],
  query: string
): GenericVideo[] {
  const VaguelyMatches = (kw: string[], titleSpell: string) => {
    if (kw.length === 0) return false

    const spell = titleSpell.split(" ")

    if (kw.length > spell.length) return false

    return spell.some((_, i) =>
      kw.every((keyword, j) => spell[i + j]?.startsWith(keyword))
    )
  }

  const IdMatches = (query: string, id: number) => {
    return query === id.toString() || id.toString().includes(query)
  }

  function videoMatchesQuery(video: GenericVideo, query: string) {
    const lowerQuery = query.toLowerCase()
    const keywords = lowerQuery.split(" ")
    const fuzzyKeywords =
      lowerQuery.indexOf(" ") === -1 ? Array.from(lowerQuery) : null

    return [
      fuzzyKeywords &&
      VaguelyMatches(fuzzyKeywords, video.composedTitleSpell.toLowerCase()),
      fuzzyKeywords &&
      VaguelyMatches(fuzzyKeywords, video.composedTitle.toLowerCase()),
      VaguelyMatches(keywords, video.composedTitleSpell.toLowerCase()),
      VaguelyMatches(keywords, video.composedTitle.toLowerCase()),
      IdMatches(lowerQuery, video.id),
      [video.artist, video.dancer, video.name].some((s) =>
        s.toLowerCase().includes(lowerQuery)
      ),
      video.ayaId && IdMatches(lowerQuery, video.ayaId),
    ].some(Boolean)
  }

  if (!query || query.length === 0) return videos
  return videos.filter((video) => {
    return videoMatchesQuery(video, query)
  })
}

export async function fetchWannaSongs(): Promise<WannaData[]> {
  return await fetchWithDefaults("https://x.kiva.moe/api/wanna/songs")
}
