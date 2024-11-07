"use client";

import { useMemo, useState } from "react";

import SongSearch from "@/components/songSearch";
import SongTable from "@/components/songTable";
import { allSongsFromGroups, GenericVideo, GenericVideoGroup, SortBy } from "@/types/video";
import { selectCollection } from "@/store/modules/collection";
import { useSelector } from "react-redux";

interface SongShowProps {
  songTypes: GenericVideoGroup[]
  loading: boolean
  selectedKey: string
  SortBy: SortBy
}

const videosQuery = (videos: GenericVideo[], query: string): GenericVideo[] => {
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

  function videoMatchesQuery(video: GenericVideo, query: string) {
    const lowerQuery = query.toLowerCase()
    const keywords = lowerQuery.split(" ")
    const fuzzyKeywords =
      lowerQuery.indexOf(" ") === -1 ? Array.from(lowerQuery) : null

    return [
      fuzzyKeywords &&
        VaguelyMatches(fuzzyKeywords, video.composedTitleSpell.toLowerCase()),
      fuzzyKeywords &&
        VaguelyMatches(fuzzyKeywords, video.composedTitle.toLowerCase()),
      VaguelyMatches(keywords, video.composedTitleSpell.toLowerCase()),
      VaguelyMatches(keywords, video.composedTitle.toLowerCase()),
      IdMatches(lowerQuery, video.id),
      [video.artist, video.dancer, video.name].some((s) =>
        s.toLowerCase().includes(lowerQuery)
      ),
      video.ayaId && IdMatches(lowerQuery, video.ayaId),
    ].some(Boolean)
  }

  if (!query || query.length === 0) return videos
  return videos.filter((video) => {
    return videoMatchesQuery(video, query)
  })
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
