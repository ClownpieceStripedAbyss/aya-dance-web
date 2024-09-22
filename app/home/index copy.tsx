"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { AppDispatch } from "@/store/index"

import SongTypeSelector from "@/components/songTypeSelector"
import {
  selectUdonInfo,
  fetchUdonInfoMultidataAction,
} from "@/store/modules/udonInfo"
import {
  fetchAyaInfoMultidataAction,
  selectAyaInfo,
} from "@/store/modules/ayaInfo"
import { initSongInfo, selectSongInfo } from "@/store/modules/songInfo"

export default function HomeBlock() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
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
    console.log(selectedKey)
  }

  return (
    <div className="relative flex flex-row items-center justify-left gap-4 py-4 md:py-4 h-full">
      <SongTypeSelector
        songTypes={songTypes}
        onSelectionChange={onSelectionChange}
        loading={!!songLoading}
      />
    </div>
  )
}
