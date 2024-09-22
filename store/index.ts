import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import songInfoReducer from "./modules/songInfo"
import counterReducer from "./modules/counter"

// 配置 Redux store
export const store = configureStore({
  reducer: {
    songInfo: songInfoReducer,
    counter: counterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
