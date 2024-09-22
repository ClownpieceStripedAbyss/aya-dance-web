import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import UdonInfoReducer from "./modules/udonInfo"
import AyaInfoReducer from "./modules/ayaInfo"
import SongInfoReducer from "./modules/songInfo"

// 配置 Redux store
export const store = configureStore({
  reducer: {
    UdonInfo: UdonInfoReducer,
    AyaInfo: AyaInfoReducer,
    SongInfo: SongInfoReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
