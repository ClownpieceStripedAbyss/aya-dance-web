import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { RootState } from "../index";
import { GenericVideo, GenericVideoGroup, GROUP_ALL_SONGS, SortBy, WannaData } from "@/types/video";
// local storage key
const SONG_INFO_KEY = "songInfo"
// local storage format version, bump this if the type `SongInfo` changes
const SONG_INFO_VERSION = 13

export interface SongInfo {
  loading: boolean
  updatedAt: string
  songTypes: GenericVideoGroup[]
  sortBy: SortBy
  version?: number
}

const initialState: SongInfo = {
  loading: true,
  updatedAt: "-1",
  songTypes: [],
  sortBy: SortBy.ID_ASC,
  version: SONG_INFO_VERSION,
}

// State保存到 localStorage
function saveToLocalStorage(data: SongInfo) {
  const jsonData = JSON.stringify(data)
  // localStorage.setItem(SONG_INFO_KEY, jsonData)
}

// 从 localStorage 解压缩State
function loadFromLocalStorage(): SongInfo | null {
  return null
  // const localSongInfo: string | null = localStorage.getItem(SONG_INFO_KEY)
  // if (!localSongInfo) return null
  // try {
  //   const saveState: SongInfo = JSON.parse(localSongInfo)
  //   const allSongEntries = getAllSongEntries(saveState)
  //   const newState = getNewState(saveState, allSongEntries)
  //   return newState
  // } catch (error) {
  //   console.log("loadFromLocalStorage error", error)
  //   return null
  // }
}

const SongInfoSlice = createSlice({
  name: "SongInfo",
  initialState,
  reducers: {
    setSortBy: (state: SongInfo, action: PayloadAction<SortBy>) => {
      console.log(action.payload, "setSortBy")
      state.sortBy = action.payload
      // saveToLocalStorage(state) // 更新本地存储
    },
  },
  extraReducers: (builder) => {
    handleFetchWannaMultidata(builder)
  },
})

// 获取歌曲信息异步Thunk
export const fetchWannaInfoMultidataAction = createAsyncThunk(
  "songInfo/fetchWannaInfoMultidataAction",
  async () => {
    const response = await fetch("/api/wannaInfo")

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return (await response.json()).data as GenericVideoGroup[]
  }
)

const handleFetchWannaMultidata = (builder: any) => {
  builder
    .addCase(fetchWannaInfoMultidataAction.pending, (state: SongInfo) => {
      if (state.updatedAt !== "-1") return // 已有数据 不判断为首次更新
      // 开始获取数据
      state.loading = true
    })
    .addCase(
      fetchWannaInfoMultidataAction.fulfilled,
      (state: SongInfo, action: PayloadAction<WannaData["data"]>) => {
        console.log("wanna fulfilled")
        const { groups, time } = action.payload
        if (time === state.updatedAt) {
          state.loading = false
          return
        } // 无需更新
        console.log("init SongInfo")
        const saveState = initSongInfo(groups, time)
        // 保存到 localStorage
        saveToLocalStorage(saveState)
        const allSongEntries = getAllSongEntries(saveState)
        const newState = getNewState(saveState, allSongEntries)
        Object.assign(state, newState)
        state.loading = false
      }
    )
    .addCase(
      fetchWannaInfoMultidataAction.rejected,
      (state: SongInfo, action: any) => {
        state.loading = false
        console.log("aya rejected")
        if (action.error) {
          console.error(action.error.message)
        }
      }
    )
}

const initSongInfo = (genericGroups: GenericVideoGroup[], time: string) => {
  const newState: SongInfo = {
    updatedAt: time,
    sortBy: SortBy.ID_ASC,
    songTypes: genericGroups,
    loading: false,
    version: SONG_INFO_VERSION,
  }
  return newState
}

const getAllSongEntries = (saveState: SongInfo) => {
  // 全部
  const genericGroups = saveState.songTypes
  return genericGroups
    .flatMap((groups) => groups.entries)
    .reduce((acc: GenericVideo[], entry) => {
      if (!acc.find((e) => e.id === entry.id)) {
        acc.push(entry)
      }
      return acc
    }, [])
    .sort((a, b) => a.composedTitle.localeCompare(b.composedTitle))
}

const getNewState = (saveState: SongInfo, allSongEntries: GenericVideo[]) => {
  const { songTypes } = saveState
  saveState.songTypes = [
    {
      title: GROUP_ALL_SONGS,
      entries: allSongEntries,
      major: "",
    } as GenericVideoGroup,
    ...songTypes,
  ]
  return saveState
}

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
export const { setSortBy } = SongInfoSlice.actions
export default SongInfoSlice.reducer
