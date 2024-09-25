import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import type { GenericVideo } from "@/types/video";
import { toast } from "react-toastify";
import { RootState, store } from "@/store";
import _ from "lodash";

interface PlayListState {
  playList: GenericVideo[]
}

const initialState: PlayListState = {
  playList: [],
}

// BroadcastChannel
const channel = new BroadcastChannel("playlist_channel")

// 监听消息
channel.onmessage = (event) => {
  console.log(event.data)
  if (event.data.action === "requestPlayList") {
    // 如果收到播放列表请求，发送当前播放列表
    store.dispatch(sendPlayList())
  } else if (event.data.action === "currentPlayList") {
    // 如果收到当前播放列表，更新本地播放列表
    store.dispatch(initPlayList(event.data.playList))
  }
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
      if (state.playList.some((item) => item.id === video.id)) {
        toast.warn("视频已在播放列表")
        console.warn("video is already in playList")
        return
      }
      state.playList = [...state.playList, video]
    },
    removePlayList: (state, action: PayloadAction<GenericVideo>) => {
      const video = action.payload
      if (!video) return console.warn("video is empty")
      state.playList = state.playList.filter((item) => item.id !== video.id)
    },
    topSong: (state, action: PayloadAction<GenericVideo>) => {
      const video = action.payload
      if (!video) return console.warn("video is empty")
      const index = state.playList.findIndex((item) => item.id === video.id)
      if (index === -1) return console.warn("video is not in playList")
      if (index === 0) {
        toast.error("正在播放")
        return
      }
      if (index === 1) {
        toast.error("已至下一首")
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
    sendPlayList: (state) => {
      channel.postMessage({
        action: "currentPlayList",
        playList: _.cloneDeep(state.playList),
      })
    },
  },
})

// 选择器函数
export const selectPlayList = createSelector(
  (state: RootState) => state.PlayList,
  (PlayList) => ({
    playList: [...PlayList.playList],
  })
)

// 导出 actions 和 reducer
export const {
  initPlayList,
  addPlayList,
  removePlayList,
  sendPlayList,
  topSong,
  nextVideo,
} = PlayListSlice.actions
export default PlayListSlice.reducer
