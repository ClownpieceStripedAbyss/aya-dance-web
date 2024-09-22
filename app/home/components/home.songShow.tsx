"use client"

import { useState, useMemo, useEffect, useRef, Component } from "react"

import SongSearch from "@/components/songSearch"
import SongTable from "@/components/songTable"
import styles from "./index.module.css"
import { Category, Video } from "@/types/ayaInfo"

interface SongShowProps {
  songTypes: Category[]
  loading: boolean
  selectedKey: string
}

export default function SongShow({
  songTypes,
  loading,
  selectedKey,
}: SongShowProps) {
  function onSearchSubmit(searchKeyword: string) {
    console.log(searchKeyword, "search keyword")
  }

  // 获取目标歌曲列表
  const [targetData, setTargetData] = useState<Video[]>([])
  useMemo(() => {
    console.log(selectedKey)
    const target = songTypes.find((item) => item.title === selectedKey)
    console.log(target, "target")
    setTargetData(target?.entries || [])
  }, [selectedKey, songTypes])
  return (
    <div
      className="flex flex-col h-full justify-between "
      style={{ width: "50vw" }}
    >
      <SongSearch onSearchSubmit={onSearchSubmit} />
      <SongTable targetData={targetData} loading={!!loading} />
    </div>
  )
}
