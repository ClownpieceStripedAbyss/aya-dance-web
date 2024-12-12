// 保存数据到localStorage
export function SaveToStorage<T>(key: string, data: T): void {
  try {
    const jsonData = JSON.stringify(data)
    localStorage.setItem(key, jsonData)
  } catch (error) {
    console.error("Save to storage error:", error)
  }
}

// 从localStorage读取数据
export function LoadFromStorage<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key)
    if (!data) return null
    return JSON.parse(data) as T
  } catch (error) {
    console.error("Load from storage error:", error)
    return null
  }
}

// 从localStorage删除数据
export function RemoveFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error("Remove from storage error:", error)
  }
}
