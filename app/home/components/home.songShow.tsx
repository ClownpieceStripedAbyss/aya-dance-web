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

interface SongShowProps {
  songTypes: GenericVideoGroup[]
  loading: boolean
  selectedKey: string
  SortBy: SortBy
}

const videoSort = (videos: GenericVideo[], sortBy: SortBy): GenericVideo[] => {
  const videosCopy = [...videos]
  return videosCopy.sort((a, b) => {
    switch (sortBy) {
      case SortBy.ID_ASC:
        return a.id - b.id
      case SortBy.ID_DESC:
        return b.id - a.id
      case SortBy.TITLE_ASC:
        return a.composedTitle.localeCompare(b.composedTitle)
      case SortBy.TITLE_DESC:
        return b.composedTitle.localeCompare(a.composedTitle)
      default:
        return 0 // should never happen
    }
  })
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

  // 获取收藏
  const collection = useSelector(selectCollection)

  // 获取目标歌曲列表
  const [genericVideos, setGenericVideos] = useState<GenericVideo[]>([])

  useMemo(() => {
    // 收藏逻辑
    let targetEntries: GenericVideo[] = []
    if (selectedKey === "Favorites") {
      const allSongs = allSongsFromGroups(songTypes)
      targetEntries = allSongs.filter((item) => {
        return collection.includes(item.id)
      })
    } else
      targetEntries =
        songTypes.find((item) => item.title === selectedKey)?.entries || []
    // 添加收藏

    const searchEntries = videosQuery(targetEntries, searchKeyword)
    const sortedEntries = videoSort(searchEntries, SortBy)

    setGenericVideos(sortedEntries || [])
  }, [SortBy, searchKeyword, selectedKey, songTypes, collection])

  return (
    <div className="flex flex-col justify-between " style={{ width: "50vw" ,height: "100%"}}>
      <SongSearch onSearchSubmit={onSearchSubmit} />
      <SongTable
        genericVideos={genericVideos}
        loading={loading}
        targetKey={selectedKey}
      />
    </div>
  )
}
