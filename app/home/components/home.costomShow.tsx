"use client";

import { useEffect, useMemo, useState } from "react";

import SongSearch from "@/components/songSearch";
import TableItem from "@/components/songTable/components/tableItem";
import { allSongsFromGroups, GenericVideo, GenericVideoGroup, SortBy } from "@/types/video";
import { useDispatch, useSelector } from "react-redux";
import videosQuery from "@/utils/videosQuery";
import { editSongs, selectCustomListStore } from "@/store/modules/customPlaylist";
import { Button, ScrollShadow } from "@nextui-org/react";
import { Check, Edit } from "@/assets/icon";
import Sortable from "sortablejs";

interface SongShowProps {
  songTypes: GenericVideoGroup[]
  loading: boolean
  selectedKey: string
  SortBy: SortBy
}

export default function SongShow({ songTypes, selectedKey }: SongShowProps) {
  const [searchKeyword, setSearchKeyword] = useState("")

  function onSearchSubmit(searchKeywordString: string) {
    setSearchKeyword(searchKeywordString)
  }

  // 获取目标歌曲列表
  const [genericVideos, setGenericVideos] = useState<GenericVideo[]>([])
  const customListStore = useSelector(selectCustomListStore)
  const ids = useMemo(() => {
    const targetCustomList = customListStore.content.find(
      (item) => item.name === selectedKey
    )
    return targetCustomList?.ids || []
  }, [selectedKey, customListStore.updatedAt])
  useMemo(() => {
    const allSongs = allSongsFromGroups(songTypes)
    const songsMap = new Map(allSongs.map((song) => [song.id, song]))
    const targetEntries = ids
      .map((id) => songsMap.get(id))
      .filter((item): item is GenericVideo => !!item)
    const searchEntries = videosQuery(targetEntries, searchKeyword)

    setGenericVideos(searchEntries || [])
  }, [searchKeyword, selectedKey, songTypes, customListStore.updatedAt, ids])

  // edit

  const [videos, setVideos] = useState<GenericVideo[]>([])
  const dispatch = useDispatch()
  const [isEdit, setIsEdit] = useState(false)
  const [toBeDeletedIds, setToBeDeletedIds] = useState<number[]>([])
  useEffect(() => {
    if (isEdit) {
      const element = document.querySelector(".sortable-list")
      if (element) {
        new Sortable(element as HTMLElement, {
          animation: 150,
          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt
            if (oldIndex === newIndex) return
            if (oldIndex === undefined || newIndex === undefined) return
            const newVideos = [...videos]
            const [movedItem] = newVideos.splice(oldIndex, 1)
            newVideos.splice(newIndex, 0, movedItem)

            setVideos(newVideos)
          },
        })
      }
    }
  }, [isEdit])

  const handleToBeDeleted = (id: number) => {
    setToBeDeletedIds((prev) => {
      return prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    })
  }
  function handleEdit() {
    setIsEdit(true)
    setToBeDeletedIds([])
    setVideos(genericVideos)
  }
  function handleSubmit() {
    // dispatch(editSongs({ name: selectedKey, ids }))
    const ids = videos.map((item) => item.id)
    const nextIds = ids.filter((id) => !toBeDeletedIds.includes(id))
    dispatch(editSongs({ name: selectedKey, ids: nextIds }))
    setIsEdit(false)
    setToBeDeletedIds([])
  }

  return (
    <div
      className="flex flex-col justify-between"
      style={{ width: "50vw" }}
    >
      <SongSearch onSearchSubmit={onSearchSubmit} />
      <>
        <div className="flex justify-between items-center">
          <div className="font-bold text-l text-primary mb-4 mt-4 leading-snug">{`${genericVideos.length} Videos in ${selectedKey}`}</div>
          {!isEdit ? (
            <Button
              isIconOnly
              color="default"
              variant="light"
              aria-label="collection"
              onClick={() => {
                handleEdit()
              }}
            >
              <Edit className="w-6 h-6 text-black dark:text-white" />
            </Button>
          ) : (
            <Button
              isIconOnly
              color="default"
              variant="light"
              aria-label="collection"
              onClick={() => {
                handleSubmit()
              }}
            >
              <Check className="w-6 h-6 text-black dark:text-white" />
            </Button>
          )}
        </div>
        {/* <ScrollShadow hideScrollBar className="w-full h-[697px]">
          {genericVideos.map((item, index) => (
            <TableItem
              key={index}
              song={item}
              isEdit={isEdit}
              toBeDeleted={handleToBeDeleted}
            />
          ))}
        </ScrollShadow> */}
        {!isEdit ? (
          <ScrollShadow hideScrollBar className="w-full h-[697px]">
            {genericVideos.map((item, index) => (
              <TableItem
                key={index}
                song={item}
                isEdit={isEdit}
                toBeDeleted={handleToBeDeleted}
              />
            ))}
          </ScrollShadow>
        ) : (
          <div className="sortable-list w-full h-[697px]">
            {genericVideos.map((item, index) => (
              <TableItem
                key={index}
                song={item}
                isEdit={isEdit}
                toBeDeleted={handleToBeDeleted}
              />
            ))}
          </div>
        )}
      </>
    </div>
  )
}
