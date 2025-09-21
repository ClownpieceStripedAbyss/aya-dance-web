"use client";

import {
  Badge,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Link
} from "@nextui-org/react";

import styles from "./tableItem.module.css";

import { Delete, Grid, Heart, HeartFilled, List, Plus } from "@/assets/icon";
import { formatTag, formatTagColor, GenericVideo } from "@/types/video";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo, useState } from "react";
import { addCollection, removeCollection, selectCollection } from "@/store/modules/collection";
import { addPlayList, QueueVideo } from "@/store/modules/playList";
import { addSongToCustomList, selectCustomListStore } from "@/store/modules/customPlaylist";
import clsx from "clsx";
import { AddSongToCustomList } from "@/types/customPlayList";

interface SongTableProps {
  song: GenericVideo
  isEdit?: boolean
  handleDelete?: (id: GenericVideo) => void
}

export default function TableItem({
  song,
  isEdit,
  handleDelete,
}: SongTableProps) {
  var url = `https://api.udon.dance/Api/Songs/play?id=${song.id}`
  const videoThumbnailUrl = (video: GenericVideo): string => {
    if (!video) return ""

    return `https://aya.kiva.moe/images/${video.id}.jpg`
  }
  // 获取收藏
  const collection = useSelector(selectCollection)
  const dispatch = useDispatch()
  const isCollection = useMemo(() => {
    return collection.includes(song.id)
  }, [collection, song])
  const handleToggleCollection = useCallback(() => {
    if (isCollection) {
      dispatch(removeCollection(song.id))
    } else {
      dispatch(addCollection(song.id))
    }
  }, [dispatch, isCollection, song.id])

  const handleAddPlaylist = useCallback(() => {
    dispatch(
      addPlayList({
        video: song,
        isRandom: false,
      } as QueueVideo)
    )
  }, [song])

  const outstandingTag =
    song.tag?.find((tag) => tag === "combined-video") ??
    song.tag?.find((tag) => tag === "new")
  const customListStore = useSelector(selectCustomListStore)

  const [isDelete, setIsDelete] = useState(false)
  return (
    <div className={clsx(styles.tableItem, isDelete && styles.grayscale)}>
      <Card className="w-full h-[110px]" shadow="sm">
        <CardBody>
          <div className="w-full h-full flex justify-between items-center">
            {isEdit && <Grid className="w-4 h-4 text-black dark:text-white" />}
            <a
              href={url}
              target="_blank"
              style={{ display: "inline-block" }}
              // onClick={handleOpenVideo}
            >
              <Badge
                content={formatTag(outstandingTag)}
                color={formatTagColor(outstandingTag)}
                size="sm"
              >
                <Image
                  alt="Album cover"
                  className="object-cover"
                  height={82}
                  shadow="md"
                  src={videoThumbnailUrl(song)}
                  style={{ cursor: "pointer" }}
                  width={138}
                />
              </Badge>
            </a>
            <div className={styles.title}>
              <Link
                className={styles.hoverUnderline}
                color="foreground"
                href={url}
                target="_blank"
                // onClick={handleOpenVideo}
              >
                {song.composedTitle}
              </Link>
              <div className={styles.ids}>
                id: {song.id} {song.ayaId ? `(PyPy ID: ${song.ayaId})` : ""}{" "}
                人数：{song.playerCount}
              </div>
            </div>
            <div className={`${styles.operation} flex gap-4 items-center`}>
              <Button
                isIconOnly
                aria-label="collection"
                color="default"
                variant="light"
                onClick={handleToggleCollection}
              >
                {isCollection ? (
                  <HeartFilled className="w-6 h-6 text-red-600 dark:text-red-700" />
                ) : (
                  <Heart className="w-6 h-6 text-black dark:text-white" />
                )}
              </Button>

              <Button
                isIconOnly
                color="default"
                variant="light"
                aria-label="collection"
                onClick={handleAddPlaylist}
              >
                <List className="w-6 h-6 text-black dark:text-white" />
              </Button>
              {customListStore.names.size > 0 && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      color="default"
                      variant="light"
                      aria-label="collection"
                    >
                      <Plus className="w-6 h-6 text-black dark:text-white" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Collection Actions">
                    {Array.from(customListStore.names).map((name) => (
                      <DropdownItem
                        key={name}
                        onClick={() =>
                          dispatch(addSongToCustomList({
                            customListName: name,
                            danceId: song.id
                          } as AddSongToCustomList))
                        }
                      >
                        {name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              )}
              {isEdit && (
                <Button
                  isIconOnly
                  color="default"
                  variant="light"
                  aria-label="collection"
                  onClick={() => {
                    setIsDelete(!isDelete)
                    handleDelete && handleDelete(song)
                  }}
                >
                  <Delete className="w-6 h-6 text-black dark:text-white" />
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
