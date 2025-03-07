import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { RootState } from "../index";
import { GenericVideo, GenericVideoGroup, GROUP_ALL_SONGS, SortBy, WannaData } from "@/types/video";
import { initDB, SONG_NAME } from "@/utils/local";
// local storage key
const SONG_INFO_KEY = "songInfo"
const STORE_NAME = SONG_NAME
// local storage format version, bump this if the type `SongInfo` changes
const SONG_INFO_VERSION = 12

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

const saveToLocalStorage = async (data: SongInfo) => {
  const jsonData = JSON.stringify(data)
  const db = await initDB()
  await db.put(STORE_NAME, { key: SONG_INFO_KEY, value: jsonData })
}



const getSongInfo = async (): Promise<SongInfo | null> => {
  const db = await initDB()
  const result = await db.get(STORE_NAME, SONG_INFO_KEY)
  if (!result) return null
  const saveState: SongInfo = JSON.parse(result.value)
  const allSongEntries = getAllSongEntries(saveState)
    const newState = getNewState(saveState, allSongEntries)
    return newState
}


export const getLocalSongInfo = createAsyncThunk(
  'songInfo/getLocalSongInfo',
  async () => {
    return await getSongInfo()
  }
)
const SongInfoSlice = createSlice({
  name: "SongInfo",
  initialState,
  reducers: {
    setSortBy: (state: SongInfo, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload
      saveToLocalStorage(state)
    }
   
  },
  extraReducers: (builder) => {
    handleFetchWannaMultidata(builder)
  }
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
  builder.addCase(getLocalSongInfo.fulfilled, (state: SongInfo, action:PayloadAction<SongInfo>) => {
    const dbData = action.payload;
    if (!dbData) return
    
    if (dbData.version !== SONG_INFO_VERSION) {
    
      return;
    }
    
    Object.assign(state, dbData)
  })
    .addCase(fetchWannaInfoMultidataAction.pending, (state: SongInfo) => {
      
      if (state.updatedAt !== "-1") return // 已有数据 不判断为首次更新
      // 开始获取数据
      state.loading = true
    })
    .addCase(
      fetchWannaInfoMultidataAction.fulfilled,
      (state: SongInfo, action: PayloadAction<WannaData["data"]>) => {
        
        
        const { groups, time } = action.payload
        if (time === state.updatedAt) {
          state.loading = false
          
          return
        } // 无需更新
        
        
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
export const {  setSortBy } = SongInfoSlice.actions
export default SongInfoSlice.reducer
