"use client"

import { Video } from "@/types/ayaInfo"
import styles from "./tableItem.module.css"
import { Card, CardBody, Image, Link, Button } from "@nextui-org/react"
import { CirclePlay, Heart, HeartFilled, List, Play } from "@/assets/icon"

interface SongTableProps {
  song: Video
}

export default function tableItem({ song }: SongTableProps) {
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
  const videoThumbnailUrl = (video: Video): string => {
    if (!video) return ""
    if (video.originalUrl.length > 0) {
      const youtube = video.originalUrl.find((url) =>
        url.includes("youtube.com")
      )
      if (youtube) {
        const videoId = youtube.split("v=")[1]
        return `https://img.youtube.com/vi/${videoId}/0.jpg`
      }
    }
    return "/unity-error.jpg"
  }
  const formatVideoTitle = (): string => {
    return !!song.artist && !!song.dancer
      ? `${song.title} - ${song.artist} | ${song.dancer}`
      : song.title
  }
  return (
    !!song && (
      <div className={styles.tableItem}>
        <Card shadow="sm" className="w-full h-[110px]">
          <CardBody>
            <div className="w-full h-full flex justify-between items-center">
              <a
                href="#"
                onClick={handleOpenVideo}
                style={{ display: "inline-block" }}
              >
                <Image
                  alt="Album cover"
                  className="object-cover"
                  width={138}
                  height={82}
                  shadow="md"
                  src={videoThumbnailUrl(song)}
                  style={{ cursor: "pointer" }}
                />
              </a>
              <div className={styles.title}>
                <Link
                  href="#"
                  onClick={handleOpenVideo}
                  color="foreground"
                  className={styles.hoverUnderline}
                >
                  {formatVideoTitle()}
                </Link>
                <div className={styles.ids}>
                  id: {song.id} {song.ayaId ? `(PyPy ID: ${song.ayaId})` : ""}
                </div>
              </div>
              <div className={`${styles.operation} flex gap-4 items-center`}>
                <Button
                  isIconOnly
                  color="default"
                  variant="light"
                  aria-label="play"
                  onClick={handleOpenVideo}
                >
                  <Play className="w-6 h-6 text-black dark:text-white" />
                </Button>
                <Button
                  isIconOnly
                  color="default"
                  variant="light"
                  aria-label="collection"
                >
                  {/* <HeartFilled className="w-6 h-6 text-red-600 dark:text-red-700"/> */}
                  <Heart className="w-6 h-6 text-black dark:text-white" />
                </Button>
                <Button
                  isIconOnly
                  color="default"
                  variant="light"
                  aria-label="collection"
                >
                  <List className="w-6 h-6 text-black dark:text-white" />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  )
}
