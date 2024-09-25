"use client"

import { selectPlayList } from "@/store/modules/playList"
import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import PlyrWrapper from "@/components/PlyrWrapper"

export default function DancePage() {
  const { playList } = useSelector(selectPlayList)
  const dispatch = useDispatch()
  const song = useMemo(() => {
    if (playList.length === 0) return null
    return playList[0]
  }, [playList])
  const currentVideoUrl = useMemo(() => {
    if (song === null) return ""
    return `https://api.udon.dance/Api/Songs/play?id=${song.id}`
  }, [song])
  const flip = useMemo(() => {
    if (song === null) return undefined
    return song.flip
  }, [song])

  const onVideoEnded = () => {
    dispatch({ type: "playList/removeFirstSong" })
  }
  return (
    <>
      <PlyrWrapper
        videoUrl={currentVideoUrl}
        flip={flip}
        onVideoEnded={onVideoEnded}
      />
    </>
  )
}
