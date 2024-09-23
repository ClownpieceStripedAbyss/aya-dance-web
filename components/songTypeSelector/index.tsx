"use client";

import { useEffect, useMemo, useState } from "react";
import { Listbox, ListboxItem, ScrollShadow, Skeleton } from "@nextui-org/react";

import styles from "./index.module.css";

import { GenericVideoGroup } from "@/types/video";

interface SongTypeSelectorProps {
  songTypes: GenericVideoGroup[];
  loading: boolean;
  onSelectionChange: (selectedKey: string) => void;
}

export default function SongTypeSelector({
  songTypes,
  loading,
  onSelectionChange,
}: SongTypeSelectorProps) {
  const songTypeOptions = useMemo(() => {
    const option = songTypes.map((group: GenericVideoGroup) => {
      return {
        key: group.title,
        label: group.title,
      };
    });

    option.unshift({ key: "favorites", label: "喜欢的歌曲" });

    return option;
  }, [songTypes]);

  const [selectedKeys, setSelectedKeys] = useState(new Set(["All Songs"]));

  useEffect(() => {
    if (selectedKeys.size === 1) {
      const selectedKey = Array.from(selectedKeys)[0];

      onSelectionChange(selectedKey);
    }
  }, [selectedKeys, onSelectionChange]);

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
                <div className="h-full w-full rounded-lg bg-default-200" />
              </Skeleton>
            ))}
          </div>
        </div>
      ) : (
        <ScrollShadow hideScrollBar className="w-[220px] h-[798px]">
          <Listbox
            aria-label="songType"
            classNames={{
              base: `${styles.listbox} `,
            }}
            items={songTypeOptions}
            selectedKeys={selectedKeys}
            selectionMode="single"
            onSelectionChange={(keys) => {
              if (keys instanceof Set && keys.size > 0) {
                setSelectedKeys(keys as Set<string>);
              }
            }}
          >
            {(item) => (
              <ListboxItem
                key={item.key}
                hideSelectedIcon
                className={styles.customListboxItem}
              >
                {item.label}
              </ListboxItem>
            )}
          </Listbox>
        </ScrollShadow>
      )}
    </>
  );
}
