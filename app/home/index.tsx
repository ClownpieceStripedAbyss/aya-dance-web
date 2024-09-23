"use client";

import type { AppDispatch } from "@/store/index";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SongShow from "./components/home.songShow";

import SongTypeSelector from "@/components/songTypeSelector";
import { fetchUdonInfoMultidataAction, selectUdonInfo } from "@/store/modules/udonInfo";
import { fetchAyaInfoMultidataAction, selectAyaInfo } from "@/store/modules/ayaInfo";
import { getLocalSongInfo, initSongInfo, selectSongInfo } from "@/store/modules/songInfo";

export default function HomeBlock() {
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
    udonUrls,
  } = useSelector(selectUdonInfo);
  const {
    categories,
    defaultSortBy,
    updatedAt: ayaUpdatedAt,
    loading: ayaLoading,
  } = useSelector(selectAyaInfo);

  const {
    songTime,
    loading: songLoading,
    sortBy,
    songTypes,
  } = useSelector(selectSongInfo);

  const isLoading = udonLoading || ayaLoading;

  useEffect(() => {
    if (isLoading) return;
    // 异步获取aya和udon数据完成后初始化songInfo
    // 如果udon混入的songInfo update_at和time一致 则不更新songInfo
    if (time === songTime) return;
    // 如果获取失败 则不更新songInfo
    if (time === "-1" || ayaUpdatedAt === -1) return;
    dispatch(
      initSongInfo({
        udonGroups: groups,
        ayaCats: categories,
        defaultSortBy,
        time,
        udonFiles: udonFiles || [],
        udonUrls: udonUrls || [],
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
        loading={songLoading}
        songTypes={songTypes}
        onSelectionChange={onSelectionChange}
      />
      <SongShow
        SortBy={sortBy}
        loading={songLoading}
        selectedKey={selectedKey}
        songTypes={songTypes}
      />
    </div>
  );
}
