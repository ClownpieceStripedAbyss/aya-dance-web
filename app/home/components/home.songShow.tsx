"use client"

import { useState, useMemo, useEffect, useRef, Component } from "react"

import SongSearch from "@/components/songSearch"
import SongTable from "@/components/songTable"

import { Category, SortBy, Video } from "@/types/ayaInfo"

interface SongShowProps {
  songTypes: Category[]
  loading: boolean
  selectedKey: string
  SortBy: SortBy
}

const videosQuery = (videos: Video[], query: string): Video[] => {
  console.log(query)
  const VaguelyMatches = (kw: string[], titleSpell: string) => {
    if (kw.length === 0) return false

    const spell = titleSpell.split(" ")
    if (kw.length > spell.length) return false

    return spell.some((_, i) =>
      kw.every((keyword, j) => spell[i + j]?.startsWith(keyword))
    )
  }

  const IdMatches = (query: string, id: number) => {
    return query === id.toString() || id.toString().includes(query)
  }
  function videoMatchesQuery(video: Video, query: string) {
    const lowerQuery = query.toLowerCase()
    const keywords = lowerQuery.split(" ")
    const fuzzyKeywords =
      lowerQuery.indexOf(" ") === -1 ? Array.from(lowerQuery) : null
    return [
      fuzzyKeywords &&
        VaguelyMatches(fuzzyKeywords, video.titleSpell.toLowerCase()),
      VaguelyMatches(keywords, video.titleSpell.toLowerCase() || video.title),
      IdMatches(lowerQuery, video.id),
      video.ayaId && IdMatches(lowerQuery, video.ayaId),
    ].some(Boolean)
  }
  if (!query || query.length === 0) return videos
  //
  const filteredVideos = videos.filter((video) => {
    return videoMatchesQuery(video, query)
  })

  return filteredVideos
}
const videoSort = (videos: Video[], sortBy: SortBy): Video[] => {
  const videosCopy = [...videos]
  const sortVideo = videosCopy.sort((a, b) => {
    switch (sortBy) {
      case SortBy.ID_ASC:
        return a.id - b.id
      case SortBy.ID_DESC:
        return b.id - a.id
      case SortBy.TITLE_ASC:
        return a.title.localeCompare(b.title)
      case SortBy.TITLE_DESC:
        return b.title.localeCompare(a.title)
      default:
        return 0 // should never happen
    }
  })
  return sortVideo
}

export default function SongShow({
  songTypes,
  loading,
  selectedKey,
  SortBy,
}: SongShowProps) {
  const [searchKeyword, setSearchKeyword] = useState("")
  function onSearchSubmit(searchKeywordString: string) {
    console.log(111)
    setSearchKeyword(searchKeywordString)
  }

  // 获取目标歌曲列表
  const [targetData, setTargetData] = useState<Video[]>([])
  useMemo(() => {
    const target = songTypes.find((item) => item.title === selectedKey)
    const entries = target?.entries || []
    // 搜索
    const searchEntries = videosQuery(entries, searchKeyword)
    // 排序
    const sortedEntries = videoSort(searchEntries, SortBy)

    setTargetData(sortedEntries || [])
  }, [SortBy, searchKeyword, selectedKey, songTypes])
  return (
    <div
      className="flex flex-col h-full justify-between "
      style={{ width: "50vw" }}
    >
      <SongSearch onSearchSubmit={onSearchSubmit} />
      <SongTable
        targetData={targetData}
        targetKey={selectedKey}
        loading={!!loading}
      />
    </div>
  )
}
