import { isAnyOf, Middleware } from "@reduxjs/toolkit";
import { addPlayList, nextVideo, nextVideoWithRandom, removePlayList, topSong } from "./playList";
import _ from "lodash";
import channel, { PlayListMessage } from "@/utils/channel";
import { setLockedRandomGroup } from "@/store/modules/playOptions";
import {
  addSongToCustomList,
  createCustomList,
  deleteCustomList,
  editCustomList,
  editSongsInCustomList
} from "@/store/modules/customPlaylist";

const sendPlayListMiddleware: Middleware = (store) => (next) => (action) => {
  // 获取执行action前后状态用于比对
  const previousPlayList = store.getState().PlayList?.playList;
  const previousPlayOptions = store.getState().PlayOptions;
  const result = next(action);
  const nextPlayList = store.getState().PlayList?.playList;
  const nextPlayOptions = store.getState().PlayOptions;

  let resyncIfPlayListChanged = isAnyOf(addPlayList, removePlayList, topSong, nextVideo, nextVideoWithRandom, setLockedRandomGroup)(action) &&
    isAnyOf(previousPlayList &&
      nextPlayList &&
      previousPlayList !== nextPlayList,
      previousPlayOptions &&
      nextPlayOptions &&
      previousPlayOptions !== nextPlayOptions
    );
  let resyncIfCustomPlayListChanged = isAnyOf(
    addSongToCustomList,
    editSongsInCustomList,
    createCustomList,
    editCustomList,
    deleteCustomList,
  )(action)

  if (resyncIfPlayListChanged || resyncIfCustomPlayListChanged) {
    console.log("Shared status changed, re-syncing");
    channel.postMessage({
      action: "currentPlayList",
      playList: _.cloneDeep(nextPlayList)
    } as PlayListMessage);
    channel.postMessage({
      action: "currentPlayOptions"
    } as PlayListMessage);
  }

  return result;
};

export default sendPlayListMiddleware;
