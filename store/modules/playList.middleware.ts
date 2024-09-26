import { Middleware, isAnyOf } from "@reduxjs/toolkit"
import { addPlayList, removePlayList, topSong, nextVideo } from "./playList"
import _ from "lodash"
import channel from "@/utils/channel"

const sendPlayListMiddleware: Middleware = (store) => (next) => (action) => {
  // 获取执行action前后状态用于比对
  const previousPlayList = store.getState().PlayList?.playList
  const result = next(action)
  const nextPlayList = store.getState().PlayList?.playList

  if (
    isAnyOf(addPlayList, removePlayList, topSong, nextVideo)(action) &&
    previousPlayList &&
    nextPlayList &&
    previousPlayList !== nextPlayList
  ) {
    channel.postMessage({
      action: "currentPlayList",
      playList: _.cloneDeep(nextPlayList),
    })
  }

  return result
}

export default sendPlayListMiddleware
