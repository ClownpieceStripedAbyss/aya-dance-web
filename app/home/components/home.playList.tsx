"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { initPlayList, selectPlayList } from "@/store/modules/playList"
import { useDispatch, useSelector } from "react-redux"

interface PlyaListProps {}

export default function PlayList({}: PlyaListProps) {
  const { playList } = useSelector(selectPlayList)
  const dispatch = useDispatch()

  return (
    <>
      {playList.length > 0 && (
        <div className="absolute top-0 right-[-17.5vw] w-[17vw] h-12 bg-gray-50 my-4 rounded-r-md">
          {playList.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-center text-gray-400"
            >
              <span className="mr-2">{item.id}.</span>
              <span className="mr-2">{item.composedTitle}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
