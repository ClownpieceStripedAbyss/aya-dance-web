"use client";

import { Card, CardBody, CardHeader, Divider, ScrollShadow } from "@nextui-org/react";
import { useCallback } from "react";
import { nextVideoWithRandom, QueueVideo, selectPlayList, topSong } from "@/store/modules/playList";
import { useDispatch, useSelector } from "react-redux";
import { computeNextQueueCandidates, formatGenreColor } from "@/types/video";
import Link from "next/link";
import { Play } from "@/assets/icon";
import { selectSongInfo } from "@/store/modules/songInfo";
import { selectPlayOptions } from "@/store/modules/playOptions";
import { selectCollection } from "@/store/modules/collection";
import { selectCustomListStore } from "@/store/modules/customPlaylist";

interface PlyaListProps { }

export default function PlayList({ }: PlyaListProps) {
  const { playList } = useSelector(selectPlayList)
  const { songTypes } = useSelector(selectSongInfo)
  const { lockedRandomGroup } = useSelector(selectPlayOptions)
  const collection = useSelector(selectCollection);
  const customList = useSelector(selectCustomListStore);
  const dispatch = useDispatch()
  const handleTopSong = useCallback(
    (video: QueueVideo) => () => {
      dispatch(topSong(video))
    },
    [dispatch]
  )
  const handleNextSong = useCallback(() => {
    let nextEntries = computeNextQueueCandidates(songTypes, collection, customList, lockedRandomGroup);
    dispatch(nextVideoWithRandom(nextEntries));
  }, [dispatch, songTypes, collection, customList, lockedRandomGroup])
  return (
    <>
      {playList.length > 0 && (
        <div className="absolute box-border top-0 right-[-17vw] w-[17vw] h-full  py-4 rounded-r-md">
          <ScrollShadow hideScrollBar className="w-full h-[93.2%]">
            {playList.map((item, idx) => (
              <a
                href="#"
                key={item.video.id}
                className="w-full"
                onClick={idx != 0 ? handleTopSong(item) : undefined}
              >
                <Card key={item.video.id} className="w-[96%] m-2" shadow="sm">
                  <CardHeader>
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-tiny ${formatGenreColor(item.video.genre)}`}>{item.video.genre}</span>
                      <span className="text-tiny">[{item.video.playerCount}P]</span>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <div
                      key={item.video.id}
                      className="flex items-center justify-left "
                    >
                      {idx == 0 && (
                        <Play className="w-6 h-6 text-black dark:text-white mr-1.5" />
                      )}
                      <span className="mr-3">{item.video.id}</span>
                      <span className={formatGenreColor(item.video.genre)}>{item.video.composedTitle}</span>
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
