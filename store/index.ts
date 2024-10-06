import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"

import SongInfoReducer from "./modules/songInfo"
import CollectionReducer from "./modules/collection"
import PlayListReducer from "./modules/playList"
import PlayOptionReducer from "./modules/playOptions"
import sendPlayListMiddleware from "./modules/playList.middleware"

// 配置 Redux store
export const store = configureStore({
  reducer: {
    SongInfo: SongInfoReducer,
    Collection: CollectionReducer,
    PlayList: PlayListReducer,
    PlayOptions: PlayOptionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sendPlayListMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
