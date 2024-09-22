import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { pinyin } from "pinyin-pro";
import { pack, unpack } from "jsonpack";

import { RootState } from "../index";

import { Category, SortBy, Video } from "@/types/ayaInfo";
import { Group, UdonDanceUdonInfo, UdonVideoFile } from "@/types/udonInfo";

// local storage key
const SONG_INFO_KEY = "songInfo";

interface SongInfo {
  loading: boolean;
  updated_at: string;
  songTypes: Category[];
  SortBy: SortBy;
}

interface initValues {
  groups: Group[]; // udon歌单表
  categories: Category[]; // aya歌单表
  defaultSortBy: SortBy; // 默认排序方式
  time: string; // udon更新时间
  udonFiles: UdonVideoFile[]; // udon文件列表
}

const initialState: SongInfo = {
  loading: true,
  updated_at: "-1",
  songTypes: [],
  SortBy: SortBy.TITLE_ASC,
};

function findMatchingAyaSong(
  udonFiles: UdonVideoFile[],
  udonSong: UdonDanceUdonInfo,
  categories: Category[],
): Video | null {
  const udonSongMd5 = udonFiles.find((file) => file.id === udonSong.id)?.md5;

  if (!udonSongMd5) return null;
  let ayaSong = categories
    .flatMap((category) => category.entries)
    .find((ayaSong) => {
      return ayaSong.checksum === udonSongMd5;
    });

  return ayaSong || null;
}

// 压缩数据并保存到 localStorage
function saveToLocalStorage(data: SongInfo) {
  const compressedData = pack(data);

  localStorage.setItem(SONG_INFO_KEY, compressedData);
}

// 从 localStorage 解压缩数据
function loadFromLocalStorage(): SongInfo | null {
  const localSongInfo: string | null = localStorage.getItem(SONG_INFO_KEY);

  if (!localSongInfo) return null;

  return unpack(localSongInfo) as SongInfo;
}

const SongInfoSlice = createSlice({
  name: "SongInfo",
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      console.log(action.payload, "setSortBy");
      state.SortBy = action.payload;
      // TODO 性能问题 后续拆分state保存
      // saveToLocalStorage(state) // 更新本地存储
    },
    getLocalSongInfo: (state) => {
      const decompressedData = loadFromLocalStorage();

      if (decompressedData) {
        Object.assign(state, decompressedData);
      }
    },
    initSongInfo: (state, action: PayloadAction<initValues>) => {
      const { groups, categories, defaultSortBy, time, udonFiles } =
        action.payload;

      console.log(defaultSortBy, "defaultSortBy");
      const initCategories = groups.map((group) => {
        const entries =
          group.songInfos?.map((song) => {
            const ayaSong = findMatchingAyaSong(udonFiles, song, categories);

            return {
              id: song.id,
              ayaId: ayaSong?.id ?? null,
              title: song.name,
              artist: song.artist,
              dancer: song.dancer,
              category: 0,
              categoryName: group.groupName,
              titleSpell: pinyin(song.name, { pattern: "first" }),
              volume: song.volume,
              start: song.start,
              end: song.end,
              flip: song.flip,
              originalUrl: ayaSong?.originalUrl ?? [],
              checksum: ayaSong?.checksum ?? null,
            } as Video;
          }) || [];

        return {
          title: group.groupName,
          entries: entries,
        } as Category;
      });

      // 全部
      const allEntries = initCategories
        .flatMap((category) => category.entries)
        .reduce((acc: Video[], entry) => {
          if (!acc.find((e) => e.id === entry.id)) {
            acc.push(entry);
          }

          return acc;
        }, [])
        .sort((a, b) => a.title.localeCompare(b.title));

      const newState = {
        ...state,
        updated_at: time,
        SortBy: defaultSortBy,
        songTypes: [
          {
            title: "All Songs",
            entries: allEntries,
          } as Category,
          ...initCategories,
        ],
        loading: false,
      };

      Object.assign(state, newState);
      // 压缩保存到 localStorage
      saveToLocalStorage(newState);
    },
  },
});

// 选择器fn
export const selectSongInfo = (state: RootState) => ({
  loading: state.SongInfo.loading,
  updated_at: state.SongInfo.updated_at,
  songTypes: state.SongInfo.songTypes,
  SortBy: state.SongInfo.SortBy,
});

// 导出 actions 和 reducer
export const { initSongInfo, getLocalSongInfo, setSortBy } =
  SongInfoSlice.actions;
export default SongInfoSlice.reducer;
