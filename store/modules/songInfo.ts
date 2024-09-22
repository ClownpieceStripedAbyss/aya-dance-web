import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { pinyin } from "pinyin-pro"
import { RootState } from "../index"
import { Category, SortBy, Video, VideoIndex } from "@/types/ayaInfo"
import { Group, UdonDanceUdonInfo, UdonVideoFile } from "@/types/udonInfo"

interface SongInfo {
  loading: boolean
  updated_at: string
  songTypes: Category[]
  SortBy: SortBy
}

interface initValues {
  groups: Group[] // udon歌单表
  categories: Category[] // aya歌单表
  defaultSortBy: SortBy // 默认排序方式
  time: string // udon更新时间
  udonFiles: UdonVideoFile[] // udon文件列表
}

const initialState: SongInfo = {
  loading: true,
  updated_at: "-1",
  songTypes: [],
  SortBy: SortBy.TITLE_ASC,
}

function findMatchingAyaSong(
  udonFiles: UdonVideoFile[],
  udonSong: UdonDanceUdonInfo,
  categories: Category[]
): Video | null {
  const udonSongMd5 = udonFiles.find((file) => file.id === udonSong.id)?.md5
  if (!udonSongMd5) return null
  let ayaSong = categories
    .flatMap((category) => category.entries)
    .find((ayaSong) => {
      return ayaSong.checksum === udonSongMd5
    })
  return ayaSong || null
}

const SongInfoSlice = createSlice({
  name: "SongInfo",
  initialState,
  reducers: {
    initSongInfo: (state, action: PayloadAction<initValues>) => {
      const { groups, categories, defaultSortBy, time, udonFiles } =
        action.payload
      console.log("initSongInfo 内部")
      console.log(action.payload)
      const initCategories = groups.map((group) => {
        const entries =
          group.songInfos?.map((song) => {
            const ayaSong = findMatchingAyaSong(udonFiles, song, categories)
            return {
              id: song.id,
              title: song.name,
              category: 0,
              categoryName: group.groupName,
              titleSpell: pinyin(song.name, { pattern: "first" }),
              volume: song.volume,
              start: song.start,
              end: song.end,
              flip: song.flip,
              originalUrl: ayaSong?.originalUrl ?? [],
              checksum: ayaSong?.checksum ?? null,
              _matchingAya: ayaSong,
              _fromUdon: song,
            } as Video
          }) || []
        return {
          title: group.groupName,
          entries: entries,
        } as Category
      })

      console.log(initCategories, "initCategories")
      // 全部
      const allEntries = initCategories
        .flatMap((category) => category.entries)
        .reduce((acc: Video[], entry) => {
          if (!acc.find((e) => e.id === entry.id)) {
            acc.push(entry)
          }
          return acc
        }, [])
        .sort((a, b) => a.title.localeCompare(b.title))

      state.updated_at = time
      state.SortBy = defaultSortBy
      state.songTypes = [
        {
          title: "All Songs",
          entries: allEntries,
        } as Category,
        ...initCategories,
      ]
      console.log(state.songTypes, "state.songTypes ")
      state.loading = false
    },
  },
})

// 选择器fn
export const selectSongInfo = (state: RootState) => ({
  loading: state.SongInfo.loading,
  updated_at: state.SongInfo.updated_at,
  songTypes: state.SongInfo.songTypes,
  SortBy: state.SongInfo.songTypes,
})

// 导出 actions 和 reducer
export const { initSongInfo } = SongInfoSlice.actions
export default SongInfoSlice.reducer
