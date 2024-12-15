import { createSlice } from "@reduxjs/toolkit"
import { createSelector } from "reselect"

import { RootState } from "../index"
import { LoadFromStorage, SaveToStorage } from "@/utils/local"
import { toast } from "react-toastify"

// local storage key
const CUSTOM_LIST_KEY = "CustomListStore"
// local storage format version, bump this if the type `CustomList` changes
const CUSTOM_LIST_VERSION = 1

export interface CustomListStore {
  updatedAt: string
  content: CustomList[]
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
      const exists = state.content.some((item) => item.name === name)

      if (exists) {
        console.log(`CustomList ${name} already exists`)
        toast.warn("歌单已存在")
        return
      }

      state.content.push({ name, description, ids })
      state.updatedAt = new Date().toISOString()
      saveLocalCustomListStore(state)
    },

    editCustomList: (state: CustomListStore, action) => {
      const { name, description, ids, originName } = action.payload
      const index = state.content.findIndex((item) => item.name === originName)

      if (index === -1) {
        console.log(`CustomList ${originName} not found`)
        return
      }

      state.content[index] = { name, description, ids }
      state.updatedAt = new Date().toISOString()
      saveLocalCustomListStore(state)
    },

    deleteCustomList: (state: CustomListStore, action) => {
      const name = action.payload
      const index = state.content.findIndex((item) => item.name === name)

      if (index === -1) {
        console.log(`CustomList ${name} not found`)
        return
      }

      state.content.splice(index, 1)
      state.updatedAt = new Date().toISOString()
      saveLocalCustomListStore(state)
    },
    exportCustomList: (state: CustomListStore, action) => {
      const name = action.payload
      const target = state.content.find((item) => item.name === name)
      if (!target) {
        console.log(`CustomList ${name} not found`)
        return
      }
      // copy to clipboard
      const text = JSON.stringify(target)
      navigator.clipboard.writeText(text).then(
        () => {
          console.log("Copied to clipboard")
          toast.success("已复制到剪贴板")
        },
        (err) => {
          console.error("Copy failed", err)
        }
      )
    },
  },
})

// 选择器fn
export const selectCustomListStore = createSelector(
  (state: RootState) => state.CustomListStore, // 输入选择器
  (CustomListStore) => ({
    updatedAt: CustomListStore.updatedAt,
    content: CustomListStore.content,
    version: CustomListStore.version,
    names: new Set(CustomListStore.content.map((item) => item.name)),
  })
)

// 导出 actions 和 reducer
export const {
  getLocalCustomListStore,
  addCustomList,
  editCustomList,
  deleteCustomList,
  exportCustomList,
} = CustomListStoreSlice.actions
export default CustomListStoreSlice.reducer
