export interface CustomPlayList {
  name: string
  description: string
  danceIds: number[]
}

export interface EditCustomPlayList {
  edited: CustomPlayList
  originName: string
}

export interface AddSongToCustomList {
  customListName: string
  danceId: number
}

export interface EditSongsInCustomList {
  customListName: string
  danceIds: number[]
}
