"use client";

import type { AppDispatch } from "@/store/index";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SongShow from "./components/home.songShow";

import SongTypeSelector from "@/components/songTypeSelector";
import { fetchUdonInfoMultidataAction, selectUdonInfo } from "@/store/modules/udonInfo";
import { fetchAyaInfoMultidataAction, selectAyaInfo } from "@/store/modules/ayaInfo";
import { getLocalSongInfo, initSongInfo, selectSongInfo } from "@/store/modules/songInfo";
import { VideoIndex } from "@/types/ayaInfo";
import { UdonInfo, UdonVideoFile } from "@/types/udonInfo";

export interface HomeBlockProps {
  fallbackAyaInfo: VideoIndex;
  fallbackUdonInfo: UdonInfo;
  fallbackUdonFiles: UdonVideoFile[];
}

export default function HomeBlock({
  fallbackAyaInfo,
  fallbackUdonInfo,
  fallbackUdonFiles,
}: HomeBlockProps) {
  const dispatch = useDispatch<AppDispatch>();

  // 初始化
  useEffect(() => {
    dispatch(getLocalSongInfo());
    dispatch(fetchUdonInfoMultidataAction());
    dispatch(fetchAyaInfoMultidataAction());
  }, [dispatch]);

  // 获取redux数据
  const {
    groups,
    time,
    loading: udonLoading,
    udonFiles,
  } = useSelector(selectUdonInfo);
  const {
    categories,
    defaultSortBy,
    updated_at: ayaUpdated_at,
    loading: ayaLoading,
  } = useSelector(selectAyaInfo);

  const {
    updated_at,
    loading: songLoading,
    SortBy,
    songTypes,
  } = useSelector(selectSongInfo);

  const isLoading = udonLoading || ayaLoading;

  useEffect(() => {
    if (isLoading) return;
    // 异步获取aya和udon数据完成后初始化songInfo
    // 如果udon混入的songInfo update_at和time一致 则不更新songInfo
    if (time === updated_at) return;
    // 如果获取失败 则使用 fallback 数据
    if (time === "-1" || ayaUpdated_at === -1) {
      console.log("Update failed, use fallback data");
      dispatch(
        initSongInfo({
          groups: fallbackUdonInfo.groups,
          categories: fallbackAyaInfo.categories,
          defaultSortBy: fallbackAyaInfo.defaultSortBy,
          time: fallbackUdonInfo.time,
          udonFiles: fallbackUdonFiles,
        }),
      );

      return;
    }
    dispatch(
      initSongInfo({
        groups,
        categories,
        defaultSortBy,
        time,
        udonFiles: udonFiles || [],
      }),
    );
  }, [isLoading]);

  function onSelectionChange(selectedKey: string) {
    setSelectedKey(selectedKey);
  }

  const [selectedKey, setSelectedKey] = useState<string>("");

  return (
    <div className="relative flex flex-row items-center justify-between gap-4 py-4 md:py-4 h-full">
      <SongTypeSelector
        loading={!!songLoading}
        songTypes={songTypes}
        onSelectionChange={onSelectionChange}
      />
      <SongShow
        SortBy={SortBy}
        loading={!!songLoading}
        selectedKey={selectedKey}
        songTypes={songTypes}
      />
    </div>
  );
}
