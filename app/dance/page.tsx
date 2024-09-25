"use client"

import { nextVideo, selectPlayList } from "@/store/modules/playList"
import { useCallback, useMemo } from "react"
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

  const onVideoEnded = useCallback(() => {
    console.log("onVideoEnded")
    dispatch(nextVideo())
  }, [dispatch])
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
