"use client"

import { useState, useMemo } from "react"
import { Listbox, ListboxItem, Skeleton } from "@nextui-org/react"
import styles from "./index.module.css"

interface SongTypeSelectorProps {
  categories: any[]
  loading: boolean
  selectedKeys: string
}

export default function SongTypeSelector({
  categories,
  loading,
}: SongTypeSelectorProps) {
  const songTypeOptions = useMemo(() => {
    const option = categories.map((category) => {
      return {
        key: category.title,
        label: category.title,
      }
    })
    option.unshift({ key: "favorites", label: "喜欢的歌曲" })
    return option
  }, [categories])

  const [selectedKeys, setSelectedKeys] = useState(new Set(["All Songs"]))

  return (
    <>
      {loading ? (
        <div className="flex flex-wrap h-full">
          <div
            className="flex flex-col justify-between h-full py-[68px]"
            style={{ width: "10vw" }}
          >
            {Array.from({ length: 18 }).map((_, index) => (
              <Skeleton
                key={index}
                className="rounded-lg"
                style={{ padding: "12px" }}
              >
                <div className="h-full w-full rounded-lg bg-default-200"></div>
              </Skeleton>
            ))}
          </div>
        </div>
      ) : (
        <Listbox
          items={songTypeOptions}
          aria-label="songType"
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => {
            if (keys instanceof Set && keys.size > 0) {
              setSelectedKeys(keys as Set<string>)
            }
          }}
          classNames={{
            base: styles.listbox,
          }}
        >
          {(item) => (
            <ListboxItem
              key={item.key}
              hideSelectedIcon
              classNames={{
                base: styles.customListboxItem,
              }}
            >
              {item.label}
            </ListboxItem>
          )}
        </Listbox>
      )}
    </>
  )
}
