import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createSelector } from "reselect"
import { RootState } from "../index"
import type { GenericVideo } from "@/types/video"

const COLLECTION_INFO_KEY = "collection_info"

interface CollectionState {
  collection: GenericVideo["id"][]
}

const initialState: CollectionState = {
  collection: [],
}

// 从 localStorage 获取本地收藏
const getLocalCollection = (): GenericVideo["id"][] => {
  const localCollectionIds: string | null =
    localStorage.getItem(COLLECTION_INFO_KEY)

  if (!localCollectionIds) return []

  try {
    return JSON.parse(localCollectionIds).map((id: string) => Number(id))
  } catch (error) {
    console.error("获取local Ids失败:", error)
    return []
  }
}

// 保存到 localStorage
const saveLocalCollection = (collection: GenericVideo["id"][]) => {
  localStorage.setItem(COLLECTION_INFO_KEY, JSON.stringify(collection))
}

const CollectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    initCollection: (state) => {
      const localCollectionIds = getLocalCollection()
      state.collection = localCollectionIds
    },
    addCollection: (state, action: PayloadAction<GenericVideo["id"]>) => {
      const id = action.payload
      // 去重
      if (!state.collection.includes(id)) {
        state.collection.push(id)
        saveLocalCollection(state.collection)
      }
    },
    removeCollection: (state, action: PayloadAction<GenericVideo["id"]>) => {
      const id = action.payload
      state.collection = state.collection.filter((item) => item !== id)
      saveLocalCollection(state.collection)
    },
  },
})

// 选择器函数
export const selectCollection = createSelector(
  (state: RootState) => state.Collection.collection,
  (collection) => [...collection]
)

// 导出 actions 和 reducer
export const { initCollection, addCollection, removeCollection } =
  CollectionSlice.actions
export default CollectionSlice.reducer
