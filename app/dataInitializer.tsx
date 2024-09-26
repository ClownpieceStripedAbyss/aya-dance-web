"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUdonInfoMultidataAction, selectUdonInfo } from "@/store/modules/udonInfo";
import { fetchAyaInfoMultidataAction, selectAyaInfo } from "@/store/modules/ayaInfo";
import { getLocalSongInfo, initSongInfo, selectSongInfo } from "@/store/modules/songInfo";
import { initCollection } from "@/store/modules/collection";
import { AppDispatch } from "@/store";
import { initPlayList, selectPlayList } from "@/store/modules/playList";
import _ from "lodash";
import channel, { PlayListMessage } from "@/utils/channel";

export function DataInitializer() {
  const dispatch = useDispatch<AppDispatch>()
  // 获取redux数据
  const {
    groups,
    time,
    loading: udonLoading,
    udonFiles,
    udonUrls,
  } = useSelector(selectUdonInfo)
  const {
    categories,
    defaultSortBy,
    updatedAt: ayaUpdatedAt,
    loading: ayaLoading,
  } = useSelector(selectAyaInfo)
  const { playList } = useSelector(selectPlayList)
  const { songTime } = useSelector(selectSongInfo)

  const isLoading = udonLoading || ayaLoading
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
    }
  }
  // 初始化
  useEffect(() => {
    dispatch(getLocalSongInfo())
    dispatch(initCollection())
    dispatch(fetchUdonInfoMultidataAction())
    dispatch(fetchAyaInfoMultidataAction())

    channel.postMessage({ action: "requestPlayList" } as PlayListMessage)

    return () => channel.close()
  }, [dispatch])

  useEffect(() => {
    if (isLoading) return
    if (time === songTime) return
    if (time === "-1" || ayaUpdatedAt === -1) return
    dispatch(
      initSongInfo({
        udonGroups: groups,
        ayaCats: categories,
        defaultSortBy,
        time,
        udonFiles: udonFiles || [],
        udonUrls: udonUrls || [],
      })
    )
  }, [
    isLoading,
    time,
    songTime,
    ayaUpdatedAt,
    dispatch,
    groups,
    categories,
    defaultSortBy,
    udonFiles,
    udonUrls,
  ])

  return null
}
