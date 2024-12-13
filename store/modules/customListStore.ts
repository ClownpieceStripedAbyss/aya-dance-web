import { createSlice } from "@reduxjs/toolkit"
import { createSelector } from "reselect"

import { RootState } from "../index"
import { SortBy } from "@/types/video"
import { LoadFromStorage, SaveToStorage } from "@/utils/local"

// local storage key
const CUSTOM_LIST_KEY = "CustomListStore"
// local storage format version, bump this if the type `CustomList` changes
const CUSTOM_LIST_VERSION = 0

export interface CustomListStore {
  updatedAt: string
  content: CustomList[]
  sortBy: SortBy
  version?: number
}

export interface CustomList {
  name: string
  description: string
  ids: number[]
}

const initialState: CustomListStore = {
  updatedAt: "-1",
  content: [],
  sortBy: SortBy.NATURAL_ORDER,
  version: CUSTOM_LIST_VERSION,
}
function saveLocalCustomListStore(state: CustomListStore) {
  SaveToStorage(CUSTOM_LIST_KEY, state)
  console.log("Saved CustomListStore info to local storage")
  console.log(state)
}
const CustomListStoreSlice = createSlice({
  name: "customListStore",
  initialState,
  reducers: {
    getLocalCustomListStore: (state: CustomListStore) => {
      const decompressedData = LoadFromStorage<CustomListStore>(CUSTOM_LIST_KEY)
      if (!decompressedData) {
        console.log("No CustomListStore info in local storage")
        return
      }
      if (decompressedData?.version !== CUSTOM_LIST_VERSION) {
        console.log("Local CustomListStore info version mismatch, dropping")
        return
      }
      console.log("Loaded CustomListStore info from local storage")
      console.log(decompressedData)
      Object.assign(state, decompressedData)
    },

    addCustomList: (state: CustomListStore, action) => {
      const { name, description, ids } = action.payload
      state.content.push({
        name,
        description,
        ids,
      })
      state.updatedAt = new Date().toISOString()
      saveLocalCustomListStore(state)
    },
  },
})

// 选择器fn
export const selectCustomListStore = createSelector(
  (state: RootState) => state.CustomListStore, // 输入选择器
  (CustomListStore) => ({
    updatedAt: CustomListStore.updatedAt,
    content: CustomListStore.content,
    sortBy: CustomListStore.sortBy,
    version: CustomListStore.version,
  })
)

// 导出 actions 和 reducer
export const {
  getLocalCustomListStore,

  addCustomList,
} = CustomListStoreSlice.actions
export default CustomListStoreSlice.reducer
