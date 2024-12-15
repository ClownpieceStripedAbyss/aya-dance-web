"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchWannaInfoMultidataAction, getLocalSongInfo } from "@/store/modules/songInfo";
import { getLocalCustomListStore } from "@/store/modules/customPlaylist";
import { initCollection } from "@/store/modules/collection";
import { AppDispatch } from "@/store";
import { initPlayList, selectPlayList } from "@/store/modules/playList";
import _ from "lodash";
import channel, { PlayListMessage } from "@/utils/channel";
import { initPlayOptions } from "@/store/modules/playOptions";

export function DataInitializer() {
  const dispatch = useDispatch<AppDispatch>()

  const { playList } = useSelector(selectPlayList)

  // BroadcastChannel
  // 监听消息
  channel.onmessage = (event: MessageEvent<PlayListMessage>) => {
    if (event.data.action === "requestPlayList") {
      // 如果收到播放列表请求，发送当前播放列表
      console.log("发送当前播放列表", playList)
      channel.postMessage({
        action: "currentPlayList",
        playList: _.cloneDeep(playList),
      } as PlayListMessage)
    } else if (event.data.action === "currentPlayList") {
      // 如果收到当前播放列表，更新本地播放列表
      console.log("收到当前播放列表", event.data.playList)
      dispatch(initPlayList(event.data.playList!!))
    } else if (event.data.action === "currentPlayOptions") {
      // 如果收到当前播放选项，更新本地播放选项
      console.log("收到当前播放选项", event.data)
      dispatch(initPlayOptions())
    }
  }
  // 初始化
  useEffect(() => {
    dispatch(getLocalSongInfo())
    dispatch(getLocalCustomListStore())
    dispatch(initCollection())
    dispatch(initPlayOptions())
    dispatch(fetchWannaInfoMultidataAction())

    channel.postMessage({ action: "requestPlayList" } as PlayListMessage)

    return () => channel.close()
  }, [dispatch])

  return null
}
