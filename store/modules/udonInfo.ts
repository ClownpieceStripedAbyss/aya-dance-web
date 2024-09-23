import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createSelector } from "reselect"
import { RootState } from "../index"

import { UdonVideoIndex } from "@/types/udonInfo"

const initialState: UdonVideoIndex = {
  loading: true,
  groups: [],
  tags: {},
  time: "-1",
}

const UdonInfoSlice = createSlice({
  name: "UdonInfo",
  initialState,
  reducers: {
    initUdonInfo: (state) => {
      state = {
        ...initialState,
      }
    },
  },
  extraReducers: (builder) => {
    handleFetchUdonInfoMultidata(builder)
  },
})

// 选择器fn
export const selectUdonInfo = createSelector(
  (state: RootState) => state.UdonInfo,
  (UdonInfo) => ({
    loading: UdonInfo.loading,
    groups: UdonInfo.groups,
    tags: UdonInfo.tags,
    time: UdonInfo.time,
    udonFiles: UdonInfo.udonFiles,
  })
)
// 获取歌曲信息异步Thunk
export const fetchUdonInfoMultidataAction = createAsyncThunk(
  "UdonInfo/fetchUdonInfoMultidata",
  async () => {
    const [response, fileResponse] = await Promise.all([
      fetch("/api/udonInfo"),
      fetch("/api/udonFiles"),
    ])

    if (!response.ok || !fileResponse.ok) {
      throw new Error("Network response was not ok")
    }
    const data = await response.json()
    const udonFiles = await fileResponse.json()

    return {
      ...data,
      udonFiles,
    }
  }
)

const handleFetchUdonInfoMultidata = (builder: any) => {
  builder
    .addCase(fetchUdonInfoMultidataAction.pending, (state: UdonVideoIndex) => {
      state.loading = true
      // 开始获取数据
    })
    .addCase(
      fetchUdonInfoMultidataAction.fulfilled,
      (state: UdonVideoIndex, action: PayloadAction<UdonVideoIndex>) => {
        console.log("udon fulfilled")
        state.groups = action.payload.groups
        state.tags = action.payload.tags
        state.time = action.payload.time
        state.udonFiles = action.payload.udonFiles
        state.loading = false
      }
    )
    .addCase(
      fetchUdonInfoMultidataAction.rejected,
      (state: UdonVideoIndex, action: any) => {
        state.loading = false
        console.log("udon rejected")
        if (action.error) {
          console.error(action.error.message)
        }
      }
    )
}

// 导出 actions 和 reducer
export const { initUdonInfo } = UdonInfoSlice.actions
export default UdonInfoSlice.reducer
