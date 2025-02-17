import { createAsyncThunk,createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createSelector } from "reselect"
import { openDB } from "idb"
import { RootState } from "../index"
import type { GenericVideo } from "@/types/video"
import { COLLECT_NAME,initDB } from "@/utils/local";

const STORE_NAME = COLLECT_NAME

interface CollectionState {
  collection: GenericVideo["id"][]
}

const initialState: CollectionState = {
  collection: [],
}

const getLocalCollection = async (): Promise<GenericVideo["id"][]> => {
  const db = await initDB()
  
  const items = await db.getAll(STORE_NAME)
  return items.map((item) => item.id)
}


// 保存到 localStorage
const saveLocalCollection = async (id: GenericVideo["id"]) => {
  const db = await initDB()
  await db.put(STORE_NAME, { id })
}

// 移除收藏
const removeLocalCollection = async (id: GenericVideo["id"]) => {
  const db = await initDB()
  await db.delete(STORE_NAME, id)
}

export const initCollection = createAsyncThunk(
  'collection/initCollection',
  async () => {
    return await getLocalCollection(); // 返回获取的集合
  }
);
// Redux Slice
const CollectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    
    addCollection: (state, action: PayloadAction<GenericVideo["id"]>) => {
      const id = action.payload;
      if (!state.collection.includes(id)) {
        state.collection.push(id);
        saveLocalCollection(id);
      }
    },
    removeCollection: (state, action: PayloadAction<GenericVideo["id"]>) => {
      const id = action.payload;
      state.collection = state.collection.filter((item) => item !== id);
      removeLocalCollection(id);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(initCollection.fulfilled, (state, action) => {
      state.collection = action.payload; 
    });
  }
});

// 选择器函数
export const selectCollection = createSelector(
  (state: RootState) => state.Collection.collection,
  (collection) => [...collection]
)

// 导出 actions 和 reducer
export const {  addCollection, removeCollection } =
  CollectionSlice.actions
export default CollectionSlice.reducer
