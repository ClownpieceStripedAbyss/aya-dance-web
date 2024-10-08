"use client"

import { useEffect, useRef } from "react"
import { Input, Kbd } from "@nextui-org/react"

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

  function handleSubmit(value: string) {
    if (value !== "") onSearchSubmit(value)
    else onSearchSubmit("")
  }

  return (
    <>
      <Input
        ref={searchInputRef}
        aria-label="Search input"
        endContent={
          <>
            <Kbd keys={["enter"]}>Enter</Kbd>
          </>
        }
        isClearable={false}
        placeholder="搜索: ID/全名/关键字/拼音首字母..."
        size={"lg"}
        type="search"
        onValueChange={(value) => handleSubmit(value)}
      />
    </>
  )
}
