"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchUdonInfoMultidataAction,
  selectUdonInfo,
} from "@/store/modules/udonInfo"
import {
  fetchAyaInfoMultidataAction,
  selectAyaInfo,
} from "@/store/modules/ayaInfo"
import {
  getLocalSongInfo,
  initSongInfo,
  selectSongInfo,
} from "@/store/modules/songInfo"
import { initCollection } from "@/store/modules/collection"
import { AppDispatch } from "@/store"

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

  const { songTime } = useSelector(selectSongInfo)

  const isLoading = udonLoading || ayaLoading

  // 初始化
  useEffect(() => {
    const channel = new BroadcastChannel("playlist_channel")
    dispatch(getLocalSongInfo())
    dispatch(initCollection())
    dispatch(fetchUdonInfoMultidataAction())
    dispatch(fetchAyaInfoMultidataAction())
    channel.postMessage({ action: "requestPlayList" })
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
