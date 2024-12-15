"use client";

import { useEffect, useMemo, useState } from "react";

import SongSearch from "@/components/songSearch";
import SongTable from "@/components/songTable";
import videosQuery, { findSongEntries, GenericVideo, GenericVideoGroup, SortBy } from "@/types/video";
import { selectCollection } from "@/store/modules/collection";
import { useDispatch, useSelector } from "react-redux";
import { editSongs, selectCustomListStore } from "@/store/modules/customPlaylist";
import Sortable from "sortablejs";

interface SongShowProps {
  songTypes: GenericVideoGroup[]
  loading: boolean
  selectedKey: string
  SortBy: SortBy,
  isCustomPlaylist: boolean,
}

const videoSort = (videos: GenericVideo[], sortBy: SortBy): GenericVideo[] => {
  const videosCopy = [...videos];
  return videosCopy.sort((a, b) => {
    switch (sortBy) {
      case SortBy.ID_ASC:
        return a.id - b.id;
      case SortBy.ID_DESC:
        return b.id - a.id;
      case SortBy.TITLE_ASC:
        return a.composedTitle.localeCompare(b.composedTitle);
      case SortBy.TITLE_DESC:
        return b.composedTitle.localeCompare(a.composedTitle);
      default:
        return 0; // should never happen
    }
  });
};

export default function SongShow({
  songTypes,
  loading,
  selectedKey,
  SortBy,
  isCustomPlaylist
}: SongShowProps) {
  const [searchKeyword, setSearchKeyword] = useState("");

  function onSearchSubmit(searchKeywordString: string) {
    setSearchKeyword(searchKeywordString);
  }

  const dispatch = useDispatch();

  // 获取收藏
  const collection = useSelector(selectCollection);

  // 获取目标歌曲列表
  const [genericVideos, setGenericVideos] = useState<GenericVideo[]>([]);

  // For custom playlist
  const customList = useSelector(selectCustomListStore);

  // custom playlist edit mode
  interface EditingVideo {
    video: GenericVideo,
    delete: boolean,
  }

  const [stagedVideos, setStagedVideos] = useState<EditingVideo[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    if (!isEditMode) return;
    const element = document.querySelector(".sortable-list");
    if (!element) return;

    new Sortable(element as HTMLElement, {
      animation: 150,
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex === newIndex) return;
        if (oldIndex === undefined || newIndex === undefined) return;
        const newVideos = [...stagedVideos];
        const [movedItem] = newVideos.splice(oldIndex, 1);
        newVideos.splice(newIndex, 0, movedItem);

        setStagedVideos(newVideos);
      }
    });
  }, [isEditMode]);

  const handleDelete = (video: GenericVideo) => {
    setStagedVideos((prev) => {
      return prev.map((item) => {
        if (item.video.id === video.id) {
          return { video: item.video, delete: !item.delete };
        }
        return item;
      });
    });
  };

  const switchEditMode = (edit: boolean) => {
    if (edit) {
      // initialize edit mode
      setStagedVideos(genericVideos.map(x => ({ video: x, delete: false }) as EditingVideo));
    } else {
      dispatch(editSongs({
        name: selectedKey,
        ids: stagedVideos.filter(x => !x.delete).map(x => x.video.id)
      }));
      setStagedVideos([]);
    }
    setIsEditMode(edit);
  };

  // General routine for filtering and sorting on the selected key
  useMemo(() => {
    const targetEntries = findSongEntries(songTypes, selectedKey, isCustomPlaylist, collection, customList);
    const searchEntries = videosQuery(targetEntries, searchKeyword);
    const sortedEntries = isCustomPlaylist ? searchEntries : videoSort(searchEntries, SortBy);

    setGenericVideos(sortedEntries || []);
  }, [SortBy, searchKeyword, selectedKey, songTypes, collection, customList.updatedAt]);

  return (
    <div className="flex flex-col justify-between " style={{ width: "50vw" }}>
      <SongSearch onSearchSubmit={onSearchSubmit} />
      <SongTable
        genericVideos={genericVideos}
        loading={loading}
        targetKey={selectedKey}
        isCustomPlaylist={isCustomPlaylist}
        isEditMode={isCustomPlaylist && isEditMode}
        handleItemDelete={handleDelete}
        switchEditMode={isCustomPlaylist ? switchEditMode : undefined}
      />
    </div>
  );
}
