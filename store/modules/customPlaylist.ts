import { createAsyncThunk,createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import { RootState } from "../index";
import { LoadFromStorage, SaveToStorage } from "@/utils/local";
import { toast } from "react-toastify";
import { AddSongToCustomList, CustomPlayList, EditCustomPlayList, EditSongsInCustomList } from "@/types/customPlayList";

// local storage key
const CUSTOM_LIST_KEY = "CustomPlayList"
// local storage format version, bump this if the type `CustomList` changes
const CUSTOM_LIST_VERSION = 2

export interface CustomPlayListState {
  updatedAt: string
  content: CustomPlayList[]
  version?: number
}

const initialState: CustomPlayListState = {
  updatedAt: "-1",
  content: [],
  version: CUSTOM_LIST_VERSION,
}

function findTargetList(
  state: CustomPlayListState,
  name: string
): [CustomPlayList, number] {
  const targetIndex = state.content.findIndex((item) => item.name === name)
  if (targetIndex === -1) {
    console.log(`CustomList ${name} not found`)
    return [
      {
        name: "",
        description: "",
        danceIds: [],
      },
      -1,
    ]
  }
  return [state.content[targetIndex], targetIndex]
}

function saveLocalCustomListStore(state: CustomPlayListState) {
  SaveToStorage(CUSTOM_LIST_KEY, state)
  console.log(state)
}
export const getLocalCustomListStore = createAsyncThunk(
  'customList/getLocalCustomListStore',
  async () => {
    return await LoadFromStorage<CustomPlayListState>(CUSTOM_LIST_KEY); // 返回获取的数据
  }
);

const CustomListStoreSlice = createSlice({
  name: "customListStore",
  initialState,
  reducers: {
   
    createCustomList: (state: CustomPlayListState, action: PayloadAction<CustomPlayList>) => {
      const { name, description, danceIds } = action.payload
      const [_, targetIndex] = findTargetList(state, name)

      if (targetIndex != -1) {
        console.log(`CustomList ${name} already exists`)
        toast.warning("歌单已存在")
        return
      }

      state.content.push({ name, description, danceIds })
      state.updatedAt = new Date().toISOString()
      saveLocalCustomListStore(state)
    },

    editCustomList: (state: CustomPlayListState, action: PayloadAction<EditCustomPlayList>) => {
      const { edited, originName } = action.payload
      const [_, targetIndex] = findTargetList(state, originName)

      if (targetIndex === -1) {
        console.log(`CustomList ${originName} not found`)
        return
      }

      state.content[targetIndex] = edited
      state.updatedAt = new Date().toISOString()
      saveLocalCustomListStore(state)
    },

    deleteCustomList: (state: CustomPlayListState, action: PayloadAction<string>) => {
      const name = action.payload
      const [_, targetIndex] = findTargetList(state, name)

      if (targetIndex === -1) {
        console.log(`CustomList ${name} not found`)
        return
      }

      state.content.splice(targetIndex, 1)
      state.updatedAt = new Date().toISOString()
      saveLocalCustomListStore(state)
    },
    addSongToCustomList(state: CustomPlayListState, action: PayloadAction<AddSongToCustomList>) {
      const { customListName, danceId } = action.payload
      const [target, targetIndex] = findTargetList(state, customListName)
      if (targetIndex === -1) {
        console.log(`CustomList ${customListName} not found`)
        return
      }
      if (target.danceIds.includes(danceId)) {
        console.log(`CustomList ${customListName} already has song ${danceId}`)
        toast.warning("歌单已有该歌曲")
        return
      }
      target.danceIds.push(danceId)
      toast.success("歌曲添加成功")
      state.updatedAt = new Date().toISOString()
      saveLocalCustomListStore(state)
    },
    editSongsInCustomList(state: CustomPlayListState, action: PayloadAction<EditSongsInCustomList>) {
      const { customListName, danceIds } = action.payload
      const [_, targetIndex] = findTargetList(state, customListName)
      if (targetIndex === -1) {
        console.log(`CustomList ${customListName} not found`)
        return
      }
      state.content[targetIndex].danceIds = danceIds
      toast.success("歌单修改成功")
      state.updatedAt = new Date().toISOString()
      saveLocalCustomListStore(state)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLocalCustomListStore.fulfilled, (state, action) => {
      const decompressedData = action.payload; // 获取从 thunk 返回的数据
      if (!decompressedData) {
        console.log("No CustomPlayList info in local storage");
        return;
      }
      if (decompressedData.version !== CUSTOM_LIST_VERSION) {
        console.log("Local CustomPlayList info version mismatch, dropping");
        return;
      }
      Object.assign(state, decompressedData); // 更新状态
    });
  }
})

// 选择器fn
export const selectCustomListStore = createSelector(
  (state: RootState) => state.CustomListStore, // 输入选择器
  (CustomListStore) => ({
    updatedAt: CustomListStore.updatedAt,
    content: CustomListStore.content,
    findTargetList: (name: string) => findTargetList(CustomListStore, name),
    version: CustomListStore.version,
    names: new Set(CustomListStore.content.map((item) => item.name)),
  })
)

// 导出 actions 和 reducer
export const {
  addSongToCustomList,
  editSongsInCustomList,
  createCustomList,
  editCustomList,
  deleteCustomList,
} = CustomListStoreSlice.actions
export default CustomListStoreSlice.reducer
