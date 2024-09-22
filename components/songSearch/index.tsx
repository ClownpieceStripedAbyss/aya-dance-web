"use client"

import { useEffect, useRef } from "react"
import { Input, Kbd } from "@nextui-org/react"
import { ClearIcon } from "@/assets/icon"
import styles from "./index.module.css"
interface SongSearchProps {
  onSearchSubmit: (keyword: string) => void
}

export default function SongSearch({ onSearchSubmit }: SongSearchProps) {
  // input 组件 回车进入搜索 回车进行搜索
  const searchInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (
          searchInputRef.current &&
          document.activeElement !== searchInputRef.current
        ) {
          searchInputRef.current.focus()
        }
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown)
    }
  }, [])
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onSearchSubmit(event.currentTarget.value)
    }
  }
  function handleClear(value: string) {
    console.log("handleClear")
    if (value === "") onSearchSubmit("")
  }

  return (
    <>
      <Input
        ref={searchInputRef}
        size={"lg"}
        type="search"
        placeholder="搜索: ID/全名/关键字/拼音首字母..."
        aria-label="Search input"
        onKeyDown={handleKeyDown}
        isClearable={false}
        onValueChange={(value) => handleClear(value)}
        endContent={
          <>
            <Kbd keys={["enter"]}>Enter</Kbd>
          </>
        }
      />
    </>
  )
}
