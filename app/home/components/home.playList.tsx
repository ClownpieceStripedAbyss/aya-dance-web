"use client";

import { Card, CardBody, CardHeader, Divider, ScrollShadow } from "@nextui-org/react";
import { useCallback } from "react";
import { nextVideo, selectPlayList, topSong } from "@/store/modules/playList";
import { useDispatch, useSelector } from "react-redux";
import { formatGenreColor, GenericVideo } from "@/types/video";
import Link from "next/link";
import { Play } from "@/assets/icon";

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
            {playList.map((item, idx) => (
              <a
                href="#"
                key={item.id}
                className="w-full"
                onClick={idx != 0 ? handleTopSong(item) : undefined}
              >
                <Card key={item.id} className="w-[96%] m-2" shadow="sm">
                  <CardHeader>
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-tiny ${formatGenreColor(item.genre)}`}>{item.genre}</span>
                      <span className="text-tiny">[{item.playerCount}P]</span>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <div
                      key={item.id}
                      className="flex items-center justify-left "
                    >
                      {idx == 0 && (
                        <Play className="w-6 h-6 text-black dark:text-white mr-1.5" />
                      )}
                      <span className="mr-3">{item.id}</span>
                      <span className={formatGenreColor(item.genre)}>{item.composedTitle}</span>
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
