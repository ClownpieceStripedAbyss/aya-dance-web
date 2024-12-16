import { createSlice } from "@reduxjs/toolkit"
import { createSelector } from "reselect"

import { RootState } from "../index"
import { LoadFromStorage, SaveToStorage } from "@/utils/local"
import { toast } from "react-toastify"
import { CustomPlayList } from "@/types/customPlayList"

// local storage key
const CUSTOM_LIST_KEY = "CustomPlayList"
// local storage format version, bump this if the type `CustomList` changes
const CUSTOM_LIST_VERSION = 1

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
        ids: [],
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

const CustomListStoreSlice = createSlice({
  name: "customListStore",
  initialState,
  reducers: {
    getLocalCustomListStore: (state: CustomPlayListState) => {
      const decompressedData =
        LoadFromStorage<CustomPlayListState>(CUSTOM_LIST_KEY)
      if (!decompressedData) {
        console.log("No CustomPlayList info in local storage")
        return
      }
      if (decompressedData?.version !== CUSTOM_LIST_VERSION) {
        console.log("Local CustomPlayList info version mismatch, dropping")
        return
      }
      console.log("Loaded CustomPlayList info from local storage")
      console.log(decompressedData)
      Object.assign(state, decompressedData)
    },
    createCustomList: (state: CustomPlayListState, action) => {
      const { name, description, ids } = action.payload
      const [_, targetIndex] = findTargetList(state, name)

      if (targetIndex != -1) {
        console.log(`CustomList ${name} already exists`)
        toast.warning("歌单已存在")
        return
      }

      state.content.push({ name, description, ids })
      state.updatedAt = new Date().toISOString()
      saveLocalCustomListStore(state)
    },

    editCustomList: (state: CustomPlayListState, action) => {
      const { name, description, ids, originName } = action.payload
      const [_, targetIndex] = findTargetList(state, name)

      if (targetIndex === -1) {
        console.log(`CustomList ${originName} not found`)
        return
      }

      state.content[targetIndex] = { name, description, ids }
      state.updatedAt = new Date().toISOString()
      saveLocalCustomListStore(state)
    },

    deleteCustomList: (state: CustomPlayListState, action) => {
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
    addSongToCustomList(state: CustomPlayListState, action) {
      const { name, id } = action.payload
      const [target, targetIndex] = findTargetList(state, name)
      if (targetIndex === -1) {
        console.log(`CustomList ${name} not found`)
        return
      }
      if (target.ids.includes(id)) {
        console.log(`CustomList ${name} already has song ${id}`)
        toast.warning("歌单已有该歌曲")
        return
      }
      target.ids.push(id)
      toast.success("歌曲添加成功")
      state.updatedAt = new Date().toISOString()
      saveLocalCustomListStore(state)
    },
    editSongsInCustomList(state: CustomPlayListState, action) {
      const { name, ids } = action.payload
      if (ids.length === 0) {
        console.log("No song to delete")
        return
      }
      const [_, targetIndex] = findTargetList(state, name)
      if (targetIndex === -1) {
        console.log(`CustomList ${name} not found`)
        return
      }
      state.content[targetIndex].ids = ids
      toast.success("歌单修改成功")
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
    findTargetList: (name: string) => findTargetList(CustomListStore, name),
    version: CustomListStore.version,
    names: new Set(CustomListStore.content.map((item) => item.name)),
  })
)

// 导出 actions 和 reducer
export const {
  getLocalCustomListStore,
  addSongToCustomList,
  editSongsInCustomList,
  createCustomList,
  editCustomList,
  deleteCustomList,
} = CustomListStoreSlice.actions
export default CustomListStoreSlice.reducer
