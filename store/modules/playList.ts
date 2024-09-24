import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createSelector } from "reselect"
import { RootState } from "../index"
import type { GenericVideo } from "@/types/video"
import _ from "lodash"

const PLAY_LIST_INFO_KEY = "play_list_info"

interface PlayListState {
  playList: GenericVideo[]
}

const initialState: PlayListState = {
  playList: [],
}

const PlayListSlice = createSlice({
  name: "playList",
  initialState,
  reducers: {
    initPlayList: (state, action: PayloadAction<GenericVideo[]>) => {
      const playList = action.payload
      if (!playList || playList.length === 0)
        return console.warn("playList is empty")
      state.playList = playList
    },
    addPlayList: (state, action: PayloadAction<GenericVideo>) => {
      const video = action.payload
      if (!video) return console.warn("video is empty")
      // 去重
      if (state.playList.some((item) => item.id === video.id))
        return console.warn("video is already in playList")
      state.playList.push(video)
    },
    removePlayList: (state, action: PayloadAction<GenericVideo>) => {
      const video = action.payload
      if (!video) return console.warn("video is empty")
      const index = state.playList.findIndex((item) => item.id === video.id)
      if (index === -1) return console.warn("video is not in playList")
      state.playList.splice(index, 1)
    },
    topSong: (state, action: PayloadAction<GenericVideo>) => {
      const video = action.payload
      if (!video) return console.warn("video is empty")
      const index = state.playList.findIndex((item) => {
        return item.id === video.id
      })
      if (index === -1) return console.warn("video is not in playList")
      if (index === 0) {
        console.error("正在播放")
        return
      }
      if (index === 1) {
        console.error("已至下一首")
        return
      }
      state.playList.splice(index, 1)
      state.playList.splice(1, 0, video)
    },
  },
})

// 选择器函数
export const selectPlayList = createSelector(
  (state: RootState) => state.PlayList.playList,
  (playList) => [...playList]
)

// 导出 actions 和 reducer
export const { initPlayList, addPlayList, removePlayList } =
  PlayListSlice.actions
export default PlayListSlice.reducer
