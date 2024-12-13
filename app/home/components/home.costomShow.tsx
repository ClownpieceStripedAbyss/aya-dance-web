"use client"

import { useMemo, useState } from "react"

import SongSearch from "@/components/songSearch"
import SongTable from "@/components/songTable"
import {
  allSongsFromGroups,
  GenericVideo,
  GenericVideoGroup,
  SortBy,
} from "@/types/video"
import { selectCollection } from "@/store/modules/collection"
import { useSelector } from "react-redux"
import videosQuery from "@/utils/videosQuery"
import { selectCustomListStore } from "@/store/modules/customListStore"

interface SongShowProps {
  songTypes: GenericVideoGroup[]
  loading: boolean
  selectedKey: string
  SortBy: SortBy
}

export default function SongShow({
  songTypes,
  loading,
  selectedKey,
  SortBy,
}: SongShowProps) {
  const [searchKeyword, setSearchKeyword] = useState("")

  function onSearchSubmit(searchKeywordString: string) {
    setSearchKeyword(searchKeywordString)
  }

  // 获取目标歌曲列表
  const [genericVideos, setGenericVideos] = useState<GenericVideo[]>([])
  const customListStore = useSelector(selectCustomListStore)
  useMemo(() => {
    const allSongs = allSongsFromGroups(songTypes)
    const targetCustomList = customListStore.content.find(
      (item) => item.name === selectedKey
    )
    const ids = targetCustomList?.ids || []
    const targetEntries = allSongs.filter((item) => ids.includes(item.id))
    const searchEntries = videosQuery(targetEntries, searchKeyword)

    setGenericVideos(searchEntries || [])
  }, [SortBy, searchKeyword, selectedKey, songTypes])

  return (
    <div className="flex flex-col justify-between " style={{ width: "50vw" }}>
      <SongSearch onSearchSubmit={onSearchSubmit} />
      <SongTable
        genericVideos={genericVideos}
        loading={loading}
        targetKey={selectedKey}
      />
    </div>
  )
}
