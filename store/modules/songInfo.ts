import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { pinyin } from "pinyin-pro";
import { pack, unpack } from "jsonpack";

import { RootState } from "../index";

import { AyaCategory, AyaVideo } from "@/types/ayaInfo";
import { UdonGroup, UdonVideo, UdonVideoFile, UdonVideoUrl } from "@/types/udonInfo";
import { GenericVideo, GenericVideoGroup, SortBy } from "@/types/video";

// local storage key
const SONG_INFO_KEY = "songInfo"
// local storage format version, bump this if the type `SongInfo` changes
const SONG_INFO_VERSION = 7

export interface SongInfo {
  loading: boolean
  updatedAt: string
  songTypes: GenericVideoGroup[]
  sortBy: SortBy
  version?: number
}

interface InitValues {
  udonGroups: UdonGroup[] // udon歌单表
  ayaCats: AyaCategory[] // aya歌单表
  defaultSortBy: SortBy // 默认排序方式
  time: string // udon更新时间
  udonFiles: UdonVideoFile[] // udon文件列表
  udonUrls: UdonVideoUrl[] // udon视频原始链接列表
}

const initialState: SongInfo = {
  loading: true,
  updatedAt: "-1",
  songTypes: [],
  sortBy: SortBy.TITLE_ASC,
  version: SONG_INFO_VERSION,
}

function findMatchingAyaSong(
  udonFiles: UdonVideoFile[],
  udonSong: UdonVideo,
  categories: AyaCategory[]
): AyaVideo | null {
  const udonSongMd5 = udonFiles.find((file) => file.id === udonSong.id)?.md5

  if (!udonSongMd5) return null
  let ayaSong = categories
    .flatMap((category) => category.entries)
    .find((ayaSong) => {
      return ayaSong.checksum === udonSongMd5
    })

  return ayaSong || null
}

// 压缩数据并保存到 localStorage
function saveToLocalStorage(data: SongInfo) {
  const compressedData = pack(data)

  localStorage.setItem(SONG_INFO_KEY, compressedData)
}

// 从 localStorage 解压缩数据
function loadFromLocalStorage(): SongInfo | null {
  const localSongInfo: string | null = localStorage.getItem(SONG_INFO_KEY)

  if (!localSongInfo) return null

  return unpack(localSongInfo) as SongInfo
}

const SongInfoSlice = createSlice({
  name: "SongInfo",
  initialState,
  reducers: {
    setSortBy: (state: SongInfo, action: PayloadAction<SortBy>) => {
      console.log(action.payload, "setSortBy")
      state.sortBy = action.payload
      // TODO 性能问题 后续拆分state保存
      // saveToLocalStorage(state) // 更新本地存储
    },
    getLocalSongInfo: (state: SongInfo) => {
      const decompressedData = loadFromLocalStorage()
      if (!decompressedData) return
      if (decompressedData.version !== SONG_INFO_VERSION) {
        console.log("Local song info version mismatch, dropping")
        return
      }
      console.log("Loaded song info from local storage")
      console.log(decompressedData)
      Object.assign(state, decompressedData)
    },
    initSongInfo: (state: SongInfo, action: PayloadAction<InitValues>) => {
      const { udonGroups, ayaCats, defaultSortBy, time, udonFiles, udonUrls } =
        action.payload
      const genericGroups = udonGroups.map(
        (udonGroup) =>
          ({
            title: udonGroup.groupName,
            major: udonGroup.major,
            entries:
              udonGroup.songInfos?.map((udonSong) => {
                const ayaSong = findMatchingAyaSong(
                  udonFiles,
                  udonSong,
                  ayaCats
                )
                const title = `${udonSong.name} - ${udonSong.artist} | ${udonSong.dancer}`
                const originalUrlFromUdon = udonUrls.find(
                  (url) => url.id === udonSong.id
                )?.url
                const originalUrl = originalUrlFromUdon
                  ? [originalUrlFromUdon]
                  : ayaSong?.originalUrl
                const checksum =
                  udonFiles.find((f) => f.id === udonSong.id)?.md5 ??
                  ayaSong?.checksum
                return {
                  artist: udonSong.artist,
                  composedTitle: title,
                  composedTitleSpell: pinyin(title, { pattern: "first" }),
                  group: udonGroup.groupName,
                  genre: udonGroup.major,
                  dancer: udonSong.dancer,
                  doubleWidth: udonSong.double_width,
                  end: udonSong.end,
                  flip: udonSong.flip,
                  id: udonSong.id,
                  ayaId: ayaSong?.id || null,
                  name: udonSong.name,
                  playerCount: udonSong.playerCount,
                  start: udonSong.start,
                  tag: udonSong.tag,
                  volume: udonSong.volume,
                  originalUrl: originalUrl ?? [],
                  checksum: checksum ?? null,
                } as GenericVideo
              }) || [],
          }) as GenericVideoGroup
      )

      // 全部
      const allSongEntries = genericGroups
        .flatMap((groups) => groups.entries)
        .reduce((acc: GenericVideo[], entry) => {
          if (!acc.find((e) => e.id === entry.id)) {
            acc.push(entry)
          }
          return acc
        }, [])
        .sort((a, b) => a.composedTitle.localeCompare(b.composedTitle))

      const newState: SongInfo = {
        ...state,
        updatedAt: time,
        sortBy: defaultSortBy,
        songTypes: [
          {
            title: "All Songs",
            entries: allSongEntries,
            major: "",
          } as GenericVideoGroup,
          ...genericGroups,
        ],
        loading: false,
        version: SONG_INFO_VERSION,
      }

      Object.assign(state, newState)
      // 压缩保存到 localStorage
      saveToLocalStorage(newState)
    },
  },
})

// 选择器fn
export const selectSongInfo = createSelector(
  (state: RootState) => state.SongInfo, // 输入选择器
  (SongInfo) => ({
    loading: SongInfo.loading,
    songTime: SongInfo.updatedAt,
    songTypes: SongInfo.songTypes,
    sortBy: SongInfo.sortBy,
  })
)

// 导出 actions 和 reducer
export const { initSongInfo, getLocalSongInfo, setSortBy } =
  SongInfoSlice.actions
export default SongInfoSlice.reducer
