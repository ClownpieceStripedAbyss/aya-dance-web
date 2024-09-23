import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

import { RootState } from "../index"

import { Video } from "@/types/ayaInfo"
const COLLECTION_INFO_KEY = "collection_info"
interface CollectionState {
  collection: Set<string>
}

const initialState: CollectionState = {
  collection: new Set(),
}

const getLocalCollection = (): Video[] => {
  const localCollectionInfo: string | null =
    localStorage.getItem(COLLECTION_INFO_KEY)

  if (!localCollectionInfo) return []

  return JSON.parse(localCollectionInfo)
}

// 保存locaStorage
const saveLocalCollection = (collection: Video[]) => {
  localStorage.setItem(COLLECTION_INFO_KEY, JSON.stringify(collection))
}

const CollectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    initCollection: (state) => {
      const localCollection = getLocalCollection()
      state.collection = localCollection
    },
    addCollection: (state, action: PayloadAction<Video>) => {
      const video = action.payload
      // 去重
      const index = state.collection.findIndex((item) => item.id === video.id)
      if (index === -1) {
        state.collection.push(video)
      }
      saveLocalCollection(state.collection)
    },
    removeCollection: (state, action: PayloadAction<Video>) => {
      const video = action.payload
      const index = state.collection.findIndex((item) => item.id === video.id)
      if (index > -1) {
        state.collection.splice(index, 1)
      }
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
