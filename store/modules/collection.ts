import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

import { RootState } from "../index"
import type { GenericVideo } from "@/types/video"
const COLLECTION_INFO_KEY = "collection_info"
interface CollectionState {
  collection: Set<GenericVideo["id"]>
}

const initialState: CollectionState = {
  collection: new Set(),
}

const getLocalCollection = (): GenericVideo["id"][] => {
  const localCollectionIds: string | null =
    localStorage.getItem(COLLECTION_INFO_KEY)

  if (!localCollectionIds || !Array.isArray(localCollectionIds)) return []

  return JSON.parse(localCollectionIds).map((id: string) => Number(id))
}

// 保存locaStorage
const saveLocalCollection = (collection: Set<GenericVideo["id"]>) => {
  localStorage.setItem(COLLECTION_INFO_KEY, JSON.stringify(collection))
}

const CollectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    initCollection: (state) => {
      const localCollectionIds = getLocalCollection()
      state.collection = new Set(localCollectionIds)
    },
    addCollection: (state, action: PayloadAction<GenericVideo["id"]>) => {
      const id = action.payload
      // 去重
      state.collection.add(id)
      saveLocalCollection(state.collection)
    },
    removeCollection: (state, action: PayloadAction<GenericVideo["id"]>) => {
      const id = action.payload
      state.collection.delete(id)
      saveLocalCollection(state.collection)
    },
  },
})

// 选择器fn
export const selectCollection = (state: RootState) => ({
  collection: state.Collection.collection,
})

// 导出 actions 和 reducer
export const { initCollection, addCollection, removeCollection } =
  CollectionSlice.actions
export default CollectionSlice.reducer
