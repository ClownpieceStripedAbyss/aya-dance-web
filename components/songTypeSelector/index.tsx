"use client"

import { useState, useMemo, useEffect } from "react"
import { Listbox, ListboxItem, Skeleton, ScrollShadow } from "@nextui-org/react"
import styles from "./index.module.css"

import { Category } from "@/types/ayaInfo"

interface SongTypeSelectorProps {
  songTypes: Category[]
  loading: boolean
  onSelectionChange: (selectedKey: string) => void
}

export default function SongTypeSelector({
  songTypes,
  loading,
  onSelectionChange,
}: SongTypeSelectorProps) {
  const songTypeOptions = useMemo(() => {
    const option = songTypes.map((group: Category) => {
      return {
        key: group.title,
        label: group.title,
      }
    })
    option.unshift({ key: "favorites", label: "喜欢的歌曲" })
    return option
  }, [songTypes])

  const [selectedKeys, setSelectedKeys] = useState(new Set(["All Songs"]))

  useEffect(() => {
    if (selectedKeys.size === 1) {
      const selectedKey = Array.from(selectedKeys)[0]
      onSelectionChange(selectedKey)
    }
  }, [selectedKeys, onSelectionChange])

  return (
    <>
      {loading ? (
        <div className="flex flex-wrap h-full">
          <div
            className="flex flex-col justify-between h-full "
            style={{ width: "10vw" }}
          >
            {Array.from({ length: 21 }).map((_, index) => (
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
        <ScrollShadow className="w-[220px] h-[798px]" hideScrollBar>
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
              base: `${styles.listbox} `,
            }}
          >
            {(item) => (
              <ListboxItem
                key={item.key}
                className={styles.customListboxItem}
                hideSelectedIcon
              >
                {item.label}
              </ListboxItem>
            )}
          </Listbox>
        </ScrollShadow>
      )}
    </>
  )
}
