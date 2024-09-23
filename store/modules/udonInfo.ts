import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../index";

import { UdonVideoIndex } from "@/types/udonInfo";

const initialState: UdonVideoIndex = {
  loading: true,
  groups: [],
  tags: {},
  time: "-1",
};

const UdonInfoSlice = createSlice({
  name: "UdonInfo",
  initialState,
  reducers: {
    initUdonInfo: (state) => {
      state = {
        ...initialState,
      };
    },
  },
  extraReducers: (builder) => {
    handleFetchUdonInfoMultidata(builder);
  },
});

// 选择器fn
export const selectUdonInfo = (state: RootState) => ({
  loading: state.UdonInfo.loading,
  groups: state.UdonInfo.groups,
  tags: state.UdonInfo.tags,
  time: state.UdonInfo.time,
  udonFiles: state.UdonInfo.udonFiles,
  udonUrls: state.UdonInfo.udonUrls,
});

// 获取歌曲信息异步Thunk
export const fetchUdonInfoMultidataAction = createAsyncThunk(
  "UdonInfo/fetchUdonInfoMultidata",
  async () => {
    const [response, fileResponse, urlResponse] = await Promise.all([
      fetch("/api/udonInfo"),
      fetch("/api/udonFiles"),
      fetch("/api/udonUrls"),
    ]);

    if (!response.ok || !fileResponse.ok || !urlResponse.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const udonFiles = await fileResponse.json();
    const udonUrls = await urlResponse.json();

    return {
      ...data,
      udonFiles,
      udonUrls,
    } as UdonVideoIndex;
  },
);

const handleFetchUdonInfoMultidata = (builder: any) => {
  builder
    .addCase(fetchUdonInfoMultidataAction.pending, (state: UdonVideoIndex) => {
      state.loading = true;
      // 开始获取数据
    })
    .addCase(
      fetchUdonInfoMultidataAction.fulfilled,
      (state: UdonVideoIndex, action: PayloadAction<UdonVideoIndex>) => {
        console.log("udon fulfilled");
        state.groups = action.payload.groups;
        state.tags = action.payload.tags;
        state.time = action.payload.time;
        state.udonFiles = action.payload.udonFiles;
        state.udonUrls = action.payload.udonUrls;
        state.loading = false;
      },
    )
    .addCase(
      fetchUdonInfoMultidataAction.rejected,
      (state: UdonVideoIndex, action: any) => {
        state.loading = false;
        console.log("udon rejected");
        if (action.error) {
          console.error(action.error.message);
        }
      },
    );
};

// 导出 actions 和 reducer
export const { initUdonInfo } = UdonInfoSlice.actions;
export default UdonInfoSlice.reducer;
