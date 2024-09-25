"use client"

import { Card, CardBody, ScrollShadow } from "@nextui-org/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { nextVideo, selectPlayList, topSong } from "@/store/modules/playList"
import { useDispatch, useSelector } from "react-redux"
import { GenericVideo } from "@/types/video"
import Link from "next/link"

interface PlyaListProps {}

export default function PlayList({}: PlyaListProps) {
  const { playList } = useSelector(selectPlayList)
  const dispatch = useDispatch()
  const handleTopSong = useCallback(
    (video: GenericVideo) => () => {
      dispatch(topSong(video))
    },
    [dispatch]
  )
  const handleNextSong = useCallback(() => {
    dispatch(nextVideo())
  }, [dispatch])
  return (
    <>
      {playList.length > 0 && (
        <div className="absolute box-border top-0 right-[-17vw] w-[17vw] h-full  py-4 rounded-r-md">
          <ScrollShadow hideScrollBar className="w-full h-[93.2%]">
            {playList.map((item) => (
              <a
                href="#"
                key={item.id}
                className="w-full"
                onClick={handleTopSong(item)}
              >
                <Card key={item.id} className="w-[96%] m-2" shadow="sm">
                  <CardBody>
                    <div
                      key={item.id}
                      className="flex items-center justify-left "
                    >
                      <span className="">
                        {item.id} {item.composedTitle}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </a>
            ))}
          </ScrollShadow>
          <div className="w-full h-[6.8%] flex justify-end items-center">
            <Link href="#" className="text-[#006fee]" onClick={handleNextSong}>
              Next
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
