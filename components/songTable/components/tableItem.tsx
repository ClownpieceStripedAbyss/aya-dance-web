"use client";

import { Badge, Button, Card, CardBody, Image, Link } from "@nextui-org/react";

import styles from "./tableItem.module.css";

import { Heart, HeartFilled, List } from "@/assets/icon";
import { formatTag, formatTagColor, GenericVideo } from "@/types/video";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import { addCollection, removeCollection, selectCollection } from "@/store/modules/collection";
import { addPlayList, QueueVideo } from "@/store/modules/playList";

interface SongTableProps {
  song: GenericVideo
}

export default function TableItem({ song }: SongTableProps) {
  // video
  const handleOpenVideo = () => {
    // 设置视频的源
    const videoURL = `https://api.udon.dance/Api/Songs/play?id=${song.id}`
    const win = window.open("", "_blank", "noopener=false") as Window

    win.document.write(`
      <!DOCTYPE html>
      <html style="width:100%;height:100%;margin:0;padding:0;">
      <body style="width:100%;height:100%;margin:0;padding:0;overflow:hidden;">
        <video style="width:100%;height:100%;object-fit:cover;" autoplay controls>
          <source src="${videoURL}" type="video/mp4">
          您的浏览器不支持 HTML5 video 标签。
        </video>
      </body>
      </html>
    `)
  }
  const videoThumbnailUrl = (video: GenericVideo): string => {
    if (!video) return ""

    const youtube = video.originalUrl.find(
      (url) => url.includes("youtube.com") || url.includes("youtu.be")
    )
    // https:\/\/www.youtube.com\/watch?v=RddyhNe0rrk
    // https:\/\/youtu.be\/KLBuAEWehUY
    if (youtube && youtube.includes("youtube.com")) {
      const videoId = youtube.split("v=").pop()
      return `https://img.youtube.com/vi/${videoId}/0.jpg`
    }
    if (youtube && youtube.includes("youtu.be")) {
      const videoId = youtube.split("/").pop()
      return `https://img.youtube.com/vi/${videoId}/0.jpg`
    }

    return "/unity-error.jpg"
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
    dispatch(addPlayList({
      video: song,
      isRandom: false
    } as QueueVideo))
  }, [song])

  const outstandingTag =
    song.tag?.find((tag) => tag === "combined-video") ??
    song.tag?.find((tag) => tag === "new")

  return (
    <div className={styles.tableItem}>
      <Card className="w-full h-[110px]" shadow="sm">
        <CardBody>
          <div className="w-full h-full flex justify-between items-center">
            <a
              href="#"
              style={{ display: "inline-block" }}
              onClick={handleOpenVideo}
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
                href="#"
                onClick={handleOpenVideo}
              >
                {song.composedTitle}
              </Link>
              <div className={styles.ids}>
                id: {song.id} {song.ayaId ? `(PyPy ID: ${song.ayaId})` : ""}{" "}
                人数：{song.playerCount}
              </div>
            </div>
            <div className={`${styles.operation} flex gap-4 items-center`}>
              {/* <Button
                isIconOnly
                aria-label="play"
                color="default"
                variant="light"
                onClick={handleOpenVideo}
              >
                <Play className="w-6 h-6 text-black dark:text-white" />
              </Button> */}
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
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
