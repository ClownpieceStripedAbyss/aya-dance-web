import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import type { GenericVideo } from "@/types/video";
import { toast } from "react-toastify";
import { RootState } from "@/store";
import _ from "lodash";

export interface QueueVideo {
  video: GenericVideo,
  isRandom: boolean
}

interface PlayListState {
  playList: QueueVideo[]
}

const initialState: PlayListState = {
  playList: [],
}

const PlayListSlice = createSlice({
  name: "playList",
  initialState,
  reducers: {
    initPlayList: (state, action: PayloadAction<QueueVideo[]>) => {
      const playList = action.payload
      if (!playList || playList.length === 0)
        return console.warn("playList is empty")
      state.playList = playList
    },
    addPlayList: (state, action: PayloadAction<QueueVideo>) => {
      const video = action.payload
      if (!video) return console.warn("video is empty")
      if (state.playList.some((item) => item.video.id === video.video.id)) {
        toast.warn("视频已在播放列表")
        console.warn("video is already in playList")
        return
      }
      state.playList = [...state.playList, video]
    },
    removePlayList: (state, action: PayloadAction<QueueVideo>) => {
      const video = action.payload
      if (!video) return console.warn("video is empty")
      state.playList = state.playList.filter((item) => item.video.id !== video.video.id)
    },
    topSong: (state, action: PayloadAction<QueueVideo>) => {
      const video = action.payload
      if (!video) return console.warn("video is empty")
      const index = state.playList.findIndex((item) => item.video.id === video.video.id)
      if (index === -1) return console.warn("video is not in playList")
      if (index === 0) {
        toast.error("正在播放")
        return
      }
      if (index === 1) {
        toast.info("已至下一首")
        return
      }
      state.playList.splice(index, 1)
      state.playList.splice(1, 0, video)
      state.playList = _.cloneDeep(state.playList)
    },
    nextVideo: (state) => {
      if (state.playList.length === 0) {
        toast.error("播放列表暂无歌曲")
        return
      }
      state.playList.shift()
      state.playList = _.cloneDeep(state.playList)
    },
    nextVideoWithRandom: (state, action: PayloadAction<GenericVideo[]>) => {
      // the video ended is the last video in the playList,
      // check if random playList is enabled
      if (state.playList.length === 1) {
        const videos = action.payload
        if (videos.length === 0) {
          return
        }
        const randomIndex = Math.floor(Math.random() * videos.length)
        const video = videos[randomIndex]
        state.playList = _.cloneDeep([{ video, isRandom: true }])
        return;
      }
      state.playList.shift()
      state.playList = _.cloneDeep(state.playList)
    }
  },
})

// 选择器函数
export const selectPlayList = createSelector(
  (state: RootState) => state.PlayList,
  (PlayList) => {
    return {
      playList: [...PlayList.playList],
    }
  }
)

// 导出 actions 和 reducer
export const { initPlayList, addPlayList, removePlayList, topSong, nextVideo, nextVideoWithRandom } =
  PlayListSlice.actions
export default PlayListSlice.reducer
