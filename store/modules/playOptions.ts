import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { openDB } from "idb";
import { RootState } from "../index";
import type { GenericVideo } from "@/types/video";
import { OPTIONS_NAME, initDB } from "@/utils/local";
export const OPTION_KEY = "play_options"
const STORE_NAME = OPTIONS_NAME
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




const getPlayOptions = async (): Promise<PlayOptions | null> => {
  const db = await initDB()
  const opts: { key: string, value: string } | null = await db.get(STORE_NAME, OPTION_KEY)
  if (!opts || !opts.value) return null
  try {
    return JSON.parse(opts.value)
  } catch (error) {
    console.error("获取 play options 失败:", error)
    return null
  }
}


const savePlayOptions = async (options: PlayOptions) => {
  const data = JSON.stringify(options)
  const db = await initDB()
  await db.put(STORE_NAME, { key: OPTION_KEY, value: data })
}


export const initPlayOptions = createAsyncThunk(
  'playOptions/initPlayOptions',
  async () => {
    return await getPlayOptions();
  }
);

const PlayOptionSlice = createSlice({
  name: "playOptions",
  initialState,
  reducers: {

    setLockedRandomGroup: (state, action: PayloadAction<SetLockedRandomGroupPayload | null>) => {
      state.lockedRandomGroup = action.payload
      savePlayOptions(state)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(initPlayOptions.fulfilled, (state, action) => {
      state.lockedRandomGroup = action.payload?.lockedRandomGroup ?? null
    })
  }
})



// 选择器函数
export const selectPlayOptions = createSelector(
  (state: RootState) => state.PlayOptions,
  (PlayOptions) => ({
    lockedRandomGroup: PlayOptions.lockedRandomGroup,
  })
)

// 导出 actions 和 reducer
export const { setLockedRandomGroup } =
  PlayOptionSlice.actions
export default PlayOptionSlice.reducer
