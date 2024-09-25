import { Middleware, isAnyOf } from "@reduxjs/toolkit"
import {
  sendPlayList,
  addPlayList,
  removePlayList,
  topSong,
  nextVideo,
} from "./playList"

const sendPlayListMiddleware: Middleware = (store) => (next) => (action) => {
  // 获取执行action前后状态用于比对
  const previousPlayList = store.getState().PlayList?.playList
  const result = next(action)
  const nextPlayList = store.getState().PlayList?.playList

  if (
    isAnyOf(addPlayList, removePlayList, topSong, nextVideo)(action) &&
    previousPlayList !== nextPlayList
  ) {
    store.dispatch(sendPlayList())
  }

  return result
}

export default sendPlayListMiddleware
