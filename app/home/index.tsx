"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

import SongShow from "./components/home.songShow";
import PlayList from "./components/home.playList";

import SongTypeSelector from "@/components/songTypeSelector";

import { selectSongInfo } from "@/store/modules/songInfo";

export default function HomeBlock() {
  // 获取redux数据
  const { loading, sortBy, songTypes } = useSelector(selectSongInfo)

  function onSelectionChange(selectedKey: string, isCustom: boolean) {
    setSelectedKey(selectedKey)
    setIsCustom(isCustom)
  }

  const [selectedKey, setSelectedKey] = useState<string>("")
  const [isCustom, setIsCustom] = useState<boolean>(false)

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
        isCustomPlaylist={isCustom}
      />
      <PlayList />
    </div>
  )
}
