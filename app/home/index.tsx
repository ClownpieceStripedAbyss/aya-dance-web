"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { AppDispatch } from "@/store/index"

import SongTypeSelector from "@/components/songTypeSelector"
import SongTable from "@/components/songTable"
import {
  selectUdonInfo,
  fetchUdonInfoMultidataAction,
} from "@/store/modules/udonInfo"
import {
  fetchAyaInfoMultidataAction,
  selectAyaInfo,
} from "@/store/modules/ayaInfo"
import {
  initSongInfo,
  getLocalSongInfo,
  selectSongInfo,
} from "@/store/modules/songInfo"
import SongShow from "./components/home.songShow"

export default function HomeBlock() {
  const dispatch = useDispatch<AppDispatch>()
  // 初始化
  useEffect(() => {
    dispatch(getLocalSongInfo())
    dispatch(fetchUdonInfoMultidataAction())
    dispatch(fetchAyaInfoMultidataAction())
  }, [dispatch])

  // 获取redux数据
  const {
    groups,
    time,
    loading: udonLoading,
    udonFiles,
  } = useSelector(selectUdonInfo)
  const {
    categories,
    defaultSortBy,
    loading: ayaLoading,
  } = useSelector(selectAyaInfo)

  const {
    updated_at,
    loading: songLoading,
    SortBy,
    songTypes,
  } = useSelector(selectSongInfo)

  const isLoading = udonLoading || ayaLoading

  useEffect(() => {
    if (!isLoading) {
      // 异步获取aya和udon数据完成后初始化songInfo
      // 如果udon混入的songInfo update_at和time一致 则不更新songInfo
      if (time === updated_at) return
      dispatch(
        initSongInfo({
          groups,
          categories,
          defaultSortBy,
          time,
          udonFiles: udonFiles || [],
        })
      )
    }
  }, [isLoading])

  function onSelectionChange(selectedKey: string) {
    setSelectedKey(selectedKey)
  }

  const [selectedKey, setSelectedKey] = useState<string>("")
  return (
    <div className="relative flex flex-row items-center justify-between gap-4 py-4 md:py-4 h-full">
      <SongTypeSelector
        songTypes={songTypes}
        onSelectionChange={onSelectionChange}
        loading={!!songLoading}
      />
      <SongShow
        selectedKey={selectedKey}
        songTypes={songTypes}
        loading={!!songLoading}
      />
    </div>
  )
}
