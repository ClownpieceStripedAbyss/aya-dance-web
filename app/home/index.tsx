"use client"

import { useState } from "react"
import { useSelector } from "react-redux"

import SongShow from "./components/home.songShow"
import PlayList from "./components/home.playList"

import SongTypeSelector from "@/components/songTypeSelector"

import { selectSongInfo } from "@/store/modules/songInfo"

export default function HomeBlock() {
  // 获取redux数据
  const { loading, sortBy, songTypes } = useSelector(selectSongInfo)

  function onSelectionChange(selectedKey: string) {
    setSelectedKey(selectedKey)
  }

  const [selectedKey, setSelectedKey] = useState<string>("")

  return (
    <div className="relative flex flex-row items-center justify-center gap-4 py-4 md:py-4 h-full">
      <SongTypeSelector
        loading={loading}
        songTypes={songTypes}
        onSelectionChange={onSelectionChange}
      />
      <SongShow
        SortBy={sortBy}
        loading={loading}
        selectedKey={selectedKey}
        songTypes={songTypes}
      />
      <PlayList />
    </div>
  )
}
