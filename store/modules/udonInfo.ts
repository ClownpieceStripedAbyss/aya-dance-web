import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UdonInfo } from "@/types/udonInfo"
import { RootState } from "../index"

const initialState: UdonInfo = {
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
export const selectUdonInfo = (state: RootState) => ({
  loading: state.UdonInfo.loading,
  groups: state.UdonInfo.groups,
  tags: state.UdonInfo.tags,
  time: state.UdonInfo.time,
  udonFiles: state.UdonInfo.udonFiles,
})

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
    .addCase(fetchUdonInfoMultidataAction.pending, (state: UdonInfo) => {
      state.loading = true
      // 开始获取数据
    })
    .addCase(
      fetchUdonInfoMultidataAction.fulfilled,
      (state: UdonInfo, action: PayloadAction<UdonInfo>) => {
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
      (state: UdonInfo, action: any) => {
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
