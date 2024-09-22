import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchAyaVideoIndex } from "@/service/songInfo"
import { VideoIndex } from "@/types/udon-dance"
import { RootState } from "../index"

const initialState: VideoIndex = {
  loading: true,
  categories: [],
  defaultSortBy: 0,
  updated_at: -1,
}

const songInfoSlice = createSlice({
  name: "songInfo",
  initialState,
  reducers: {
    initsongInfo: (state) => {
      state.loading = true
      state.categories = []
      state.defaultSortBy = 0
      state.updated_at = -1
    },
  },
  extraReducers: (builder) => {
    handleFetchSongInfoMultidata(builder)
  },
})

// 选择器fn
export const selectSongInfo = (state: RootState) => ({
  loading: state.songInfo.loading,
  categories: state.songInfo.categories,
  defaultSortBy: state.songInfo.defaultSortBy,
  updated_at: state.songInfo.updated_at,
})

// 获取歌曲信息异步Thunk
export const fetchSongInfoMultidataAction = createAsyncThunk<VideoIndex>(
  "fetch/songInfoMultidata",
  async () => {
    const res = await fetchAyaVideoIndex()
    return res
  }
)

const handleFetchSongInfoMultidata = (builder: any) => {
  builder
    .addCase(fetchSongInfoMultidataAction.pending, (state: VideoIndex) => {
      state.loading = true
      // 开始获取数据
    })
    .addCase(
      fetchSongInfoMultidataAction.fulfilled,
      (state: VideoIndex, action: PayloadAction<VideoIndex>) => {
        console.log("fulfilled")
        state.categories = action.payload.categories
        state.defaultSortBy = action.payload.defaultSortBy
        state.updated_at = action.payload.updated_at
        state.loading = false
      }
    )
    .addCase(
      fetchSongInfoMultidataAction.rejected,
      (state: VideoIndex, action: any) => {
        state.loading = false
        console.log("rejected")
        if (action.error) {
          console.error(action.error.message)
        }
      }
    )
}

// 导出 actions 和 reducer
export const { initsongInfo } = songInfoSlice.actions
export default songInfoSlice.reducer
