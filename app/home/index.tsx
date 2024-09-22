"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { AppDispatch } from "@/store/index"
import {
  selectSongInfo,
  fetchSongInfoMultidataAction,
} from "@/store/modules/songInfo"
import SongTypeSelector from "@/components/songTypeSelector"

export default function HomeBlock() {
  // 获取redux数据
  const { categories, loading } = useSelector(selectSongInfo)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchSongInfoMultidataAction())
  }, [dispatch])

  return (
    <div className="relative flex flex-row items-center justify-left gap-4 py-4 md:py-4 h-full">
      <SongTypeSelector categories={categories} loading={!!loading} />
    </div>
  )
}
