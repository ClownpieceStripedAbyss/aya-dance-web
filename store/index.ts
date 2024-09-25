import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"

import UdonInfoReducer from "./modules/udonInfo"
import AyaInfoReducer from "./modules/ayaInfo"
import SongInfoReducer from "./modules/songInfo"
import CollectionReducer from "./modules/collection"
import PlayListReducer from "./modules/playList"
import sendPlayListMiddleware from "./modules/playList.middleware"

// 配置 Redux store
export const store = configureStore({
  reducer: {
    UdonInfo: UdonInfoReducer,
    AyaInfo: AyaInfoReducer,
    SongInfo: SongInfoReducer,
    Collection: CollectionReducer,
    PlayList: PlayListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sendPlayListMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
