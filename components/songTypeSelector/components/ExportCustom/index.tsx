"use client";

// components/ExportCustom.tsx
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Textarea,
  useDisclosure
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectCustomListStore } from "@/store/modules/customPlaylist";

import { CustomPlayList } from "@/types/customPlayList";

import { findSongEntries, GenericVideo } from "@/types/video";
import { selectSongInfo } from "@/store/modules/songInfo";

export interface ModalRef {
  onOpen: (name: string) => void
}

const ExportCustom = forwardRef<ModalRef>((_, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const customListStore = useSelector(selectCustomListStore)
  const { songTypes } = useSelector(selectSongInfo)
  const [customList, setCustomList] = useState({
    name: "",
    description: "",
    ids: [],
  } as CustomPlayList)
  const [songList, setSongList] = useState<GenericVideo[]>([])
  useImperativeHandle(ref, () => ({
    onOpen: (name) => {
      const [target, _] = customListStore.findTargetList(name)
      const allSong = findSongEntries(
        songTypes,
        name,
        true,
        target.ids,
        customListStore
      )
      setSongList(allSong)
      console.log(allSong)
      setCustomList(target)
      onOpen()
    },
  }))

  function handleCopy() {
    navigator.clipboard.writeText(exportCustom())
    toast.success("已复制到剪贴板")
  }
  function close() {
    setCustomList({
      name: "",
      description: "",
      ids: [],
    })
    setSongList([])
    onClose()
  }
  const exportCustom = () => {
    return `WannaShare:${JSON.stringify(customList)}`
  }
  return (
    <Modal size="md" isOpen={isOpen} onClose={close}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              导出歌曲列表
            </ModalHeader>
            <ModalBody>
              <ScrollShadow hideScrollBar className="w-full h-[300px]">
                <Textarea
                  isReadOnly
                  label="导出内容"
                  variant="bordered"
                  labelPlacement="outside"
                  defaultValue={exportCustom()}
                  className="max-w-full mb-2"
                />
                <div className="text-sm pb-2">列表展示</div>
                {songList.map((song) => {
                  return (
                    <div className="flex justify-between" key={song.id}>
                      <div className="text-sm w-[6%]">{song.id}</div>
                      <div
                        className="text-sm w-[85%] truncate hover:cursor-pointer"
                        title={song.composedTitle}
                      >
                        {song.composedTitle}
                      </div>
                    </div>
                  )
                })}
              </ScrollShadow>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleCopy}>
                复制到剪贴板
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
})

export default ExportCustom
