import { openDB } from "idb"

const DB_NAME = "videoCollectionDB"
export const GROUP_NAME = "groups"
export const COLLECT_NAME = "collections"
export const OPTIONS_NAME = "options"
export const SONG_NAME = "songInfo"

export  const initDB = async () => {
  return openDB(DB_NAME, 11, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(GROUP_NAME)) {
        db.createObjectStore(GROUP_NAME, { keyPath: "key" })
      }
      if (!db.objectStoreNames.contains(COLLECT_NAME)) {
        db.createObjectStore(COLLECT_NAME,{ keyPath: "id" })
      }
      if (!db.objectStoreNames.contains(OPTIONS_NAME)) {
        db.createObjectStore(OPTIONS_NAME, { keyPath: "key" })
      }
      if (!db.objectStoreNames.contains(SONG_NAME)) {
        db.createObjectStore(SONG_NAME,{ keyPath: "key" })
      }
    }
  })
}

export async function SaveToStorage<T>(key: string, data: T): Promise<void> {
  try {
    const jsonData = JSON.stringify(data)
    const db = await initDB()
    await db.put(GROUP_NAME, { key, value:jsonData })
  } catch (error) {
    console.error("Save to IndexedDB error:", error)
  }
}

export async function LoadFromStorage<T>(key: string): Promise<T | null> {
  try {
    console.log("----")
    const db = await initDB()
    const result = await db.get(GROUP_NAME, key)
    console.log(result)
    return result ? JSON.parse(result.value) as T : null
  } catch (error) {
    console.error("Load from IndexedDB error:", error)
    return null
  }
}

export async function RemoveFromStorage(key: string): Promise<void> {
  try {
    const db = await initDB()
    await db.delete(GROUP_NAME, key)
  } catch (error) {
    console.error("Remove from IndexedDB error:", error)
  }
}
