import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { RootState } from "../index";
import type { GenericVideo } from "@/types/video";

export const OPTION_KEY = "play_options"

export interface PlayOptions {
  lockedRandomGroup: SetLockedRandomGroupPayload | null,
}

// I NEED ADT and pattern matching!!!
export interface SetLockedRandomGroupPayload {
  group: GenericVideo["group"]
  isCustom: boolean
}

const initialState: PlayOptions = {
  lockedRandomGroup: null,
}

export const getPlayOptions = (): PlayOptions | null => {
  const opts: string | null =
    localStorage.getItem(OPTION_KEY)

  if (!opts) return null

  try {
    return JSON.parse(opts)
  } catch (error) {
    console.error("获取 play options 失败:", error)
    return null
  }
}

// 保存到 localStorage
const savePlayOptions = (options: PlayOptions) => {
  localStorage.setItem(OPTION_KEY, JSON.stringify(options))
}

const PlayOptionSlice = createSlice({
  name: "playOptions",
  initialState,
  reducers: {
    initPlayOptions: (state) => {
      const localOptions = getPlayOptions()
      state.lockedRandomGroup = localOptions?.lockedRandomGroup ?? null
    },
    setLockedRandomGroup: (state, action: PayloadAction<SetLockedRandomGroupPayload | null>) => {
      state.lockedRandomGroup = action.payload
      savePlayOptions(state)
    }
  },
})

// 选择器函数
export const selectPlayOptions = createSelector(
  (state: RootState) => state.PlayOptions,
  (PlayOptions) => ({
    lockedRandomGroup: PlayOptions.lockedRandomGroup,
  })
)

// 导出 actions 和 reducer
export const { initPlayOptions, setLockedRandomGroup } =
  PlayOptionSlice.actions
export default PlayOptionSlice.reducer
