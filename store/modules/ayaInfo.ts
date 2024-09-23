import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../index";

import { type AyaVideoIndex } from "@/types/ayaInfo";
import { SortBy } from "@/types/video";

const initialState: AyaVideoIndex = {
  loading: true,
  categories: [],
  defaultSortBy: SortBy.TITLE_ASC,
  updated_at: -1,
};

const AyaInfoSlice = createSlice({
  name: "AyaInfo",
  initialState,
  reducers: {
    initAyaInfo: (state) => {
      state = {
        ...initialState,
      };
    },
  },
  extraReducers: (builder) => {
    handleFetchAyaInfoMultidata(builder);
  },
});

// 选择器fn
export const selectAyaInfo = (state: RootState) => ({
  loading: state.AyaInfo.loading,
  categories: state.AyaInfo.categories,
  defaultSortBy: state.AyaInfo.defaultSortBy,
  updatedAt: state.AyaInfo.updated_at,
});

// 获取歌曲信息异步Thunk
export const fetchAyaInfoMultidataAction = createAsyncThunk(
  "ayaInfo/fetchAyaInfoMultidata",
  async () => {
    const response = await fetch("/api/ayaInfo");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    return data;
  },
);

const handleFetchAyaInfoMultidata = (builder: any) => {
  builder
    .addCase(fetchAyaInfoMultidataAction.pending, (state: AyaVideoIndex) => {
      state.loading = true;
      // 开始获取数据
    })
    .addCase(
      fetchAyaInfoMultidataAction.fulfilled,
      (state: AyaVideoIndex, action: PayloadAction<AyaVideoIndex>) => {
        console.log("aya fulfilled");
        state.categories = action.payload.categories;
        state.updated_at = action.payload.updated_at;
        state.defaultSortBy = action.payload.defaultSortBy;
        state.loading = false;
      },
    )
    .addCase(
      fetchAyaInfoMultidataAction.rejected,
      (state: AyaVideoIndex, action: any) => {
        state.loading = false;
        console.log("aya rejected");
        if (action.error) {
          console.error(action.error.message);
        }
      },
    );
};

// 导出 actions 和 reducer
export const { initAyaInfo } = AyaInfoSlice.actions;
export default AyaInfoSlice.reducer;
