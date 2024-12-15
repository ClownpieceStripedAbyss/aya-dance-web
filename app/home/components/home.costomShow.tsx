"use client"

import { useMemo, useState } from "react"

import SongSearch from "@/components/songSearch"
import TableItem from "@/components/songTable/components/tableItem"
import {
  allSongsFromGroups,
  GenericVideo,
  GenericVideoGroup,
  SortBy,
} from "@/types/video"
import { useSelector } from "react-redux"
import videosQuery from "@/utils/videosQuery"
import { selectCustomListStore } from "@/store/modules/customListStore"
import { ScrollShadow } from "@nextui-org/react"

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
  }, [searchKeyword, selectedKey, songTypes, customListStore.updatedAt])

  return (
    <div
      className="flex flex-col justify-between "
      style={{ width: "50vw", height: "100%" }}
    >
      <SongSearch onSearchSubmit={onSearchSubmit} />
      <>
        <div className="font-bold text-l text-primary mb-4 mt-4 leading-snug">{`${genericVideos.length} Videos in ${selectedKey}`}</div>
        <ScrollShadow hideScrollBar className="w-full h-[697px]">
          {genericVideos.map((item, index) => (
            <TableItem key={index} song={item} />
          ))}
        </ScrollShadow>
      </>
    </div>
  )
}
