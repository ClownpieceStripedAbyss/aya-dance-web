"use client";

import { useEffect, useMemo, useState } from "react";

import SongSearch from "@/components/songSearch";
import SongTable from "@/components/songTable";
import videosQuery, { findSongEntries, GenericVideo, GenericVideoGroup, SortBy } from "@/types/video";
import { selectCollection } from "@/store/modules/collection";
import { useDispatch, useSelector } from "react-redux";
import { editSongsInCustomList, selectCustomListStore } from "@/store/modules/customPlaylist";
import Sortable from "sortablejs";
import { EditSongsInCustomList } from "@/types/customPlayList";

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

  // Favorite songs
  const collection = useSelector(selectCollection);

  // Videos in the currently selected group, without filtering but respecting sorting
  const [genericAllVideos, setGenericAllVideos] = useState<GenericVideo[]>([]);
  // Currently displaying videos, filtered by searchKeyword out of `genericAllVideos`
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
        setStagedVideos((stagedVideos) => {
          // move the element in oldIndex to newIndex, and shift other elements accordingly
          const newVideos = [...stagedVideos];
          const [removed] = newVideos.splice(oldIndex, 1);
          newVideos.splice(newIndex, 0, removed)
          return newVideos;
        });
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
      console.log("initialize edit mode, ids = " + genericAllVideos.map(x => x.id).join(", "));
      setStagedVideos(genericAllVideos.map(x => ({ video: x, delete: false }) as EditingVideo));
    } else {
      let danceIds = stagedVideos.filter(x => !x.delete).map(x => x.video.id);
      console.log("exit edit mode, ids = ", danceIds.join(", "));
      dispatch(editSongsInCustomList({
        customListName: selectedKey,
        danceIds: danceIds
      } as EditSongsInCustomList));
      setStagedVideos([]);
    }
    setIsEditMode(edit);
  };

  // General routine for filtering and sorting on the selected key
  useMemo(() => {
    const targetEntries = findSongEntries(songTypes, selectedKey, isCustomPlaylist, collection, customList);
    const sortedTargetEntries = isCustomPlaylist ? targetEntries : videoSort(targetEntries, SortBy);

    const sortedSearchEntries = videosQuery(sortedTargetEntries, searchKeyword);

    setGenericAllVideos(sortedTargetEntries);
    setGenericVideos(sortedSearchEntries || []);
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
