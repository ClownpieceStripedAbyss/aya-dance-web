"use client";

export const runtime = "nodejs";

import { nextVideo, selectPlayList } from "@/store/modules/playList";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlyrWrapper from "@/components/PlyrWrapper";

export default function DancePage() {
  const { playList } = useSelector(selectPlayList);
  const dispatch = useDispatch();
  const video = useMemo(() => playList[0] ?? null, [playList]);

  const onVideoEnded = useCallback(() => {
    console.log("onVideoEnded");
    dispatch(nextVideo());
  }, [dispatch]);

  return (
    <>
      <PlyrWrapper
        video={video}
        onVideoEnded={onVideoEnded}
      />
    </>
  );
}
