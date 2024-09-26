import { isAnyOf, Middleware } from "@reduxjs/toolkit";
import { addPlayList, nextVideo, nextVideoWithRandom, removePlayList, topSong } from "./playList";
import _ from "lodash";
import channel, { PlayListMessage } from "@/utils/channel";

const sendPlayListMiddleware: Middleware = (store) => (next) => (action) => {
  // 获取执行action前后状态用于比对
  const previousPlayList = store.getState().PlayList?.playList
  const result = next(action)
  const nextPlayList = store.getState().PlayList?.playList

  if (
    isAnyOf(addPlayList, removePlayList, topSong, nextVideo, nextVideoWithRandom)(action) &&
    previousPlayList &&
    nextPlayList &&
    previousPlayList !== nextPlayList
  ) {
    channel.postMessage({
      action: "currentPlayList",
      playList: _.cloneDeep(nextPlayList),
    } as PlayListMessage)
  }

  return result
}

export default sendPlayListMiddleware
