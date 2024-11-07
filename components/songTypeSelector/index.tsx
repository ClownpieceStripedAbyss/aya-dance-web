"use client";

import { Key, useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Skeleton,
  Textarea,
  useDisclosure
} from "@nextui-org/react";

import styles from "./index.module.css";
import { findSongById, GenericVideoGroup } from "@/types/video";
import { Button } from "@nextui-org/button";
import { useDispatch, useSelector } from "react-redux";
import { addCollection, selectCollection } from "@/store/modules/collection";
import { ExportIcon } from "@/assets/icon";

interface SongTypeSelectorProps {
  songTypes: GenericVideoGroup[];
  loading: boolean;
  onSelectionChange: (selectedKey: string) => void;
}

function groupBy<K, V>(array: V[], grouper: (item: V) => K) {
  return array.reduce((store: Map<K, V[]>, item) => {
    var key = grouper(item);
    if (!store.has(key)) {
      store.set(key, [item]);
    } else {
      store.get(key)!!.push(item);
    }
    return store;
  }, new Map<K, V[]>());
}

export default function SongTypeSelector({
  songTypes,
  loading,
  onSelectionChange
}: SongTypeSelectorProps) {
  const songTypeOptions = useMemo(() => {
    const option = songTypes.map((group: GenericVideoGroup) => {
      return {
        key: group.title,
        label: group.title,
        major: group.major
      };
    });

    option.unshift({ key: "Favorites", label: "喜欢的歌曲", major: "" });

    let groups: {
      major: string
      items: { key: string; label: string }[]
    }[] = [];
    groupBy(option, (item) => item.major).forEach((value, major) => {
      groups.push({
        major: major === "" ? "À la carte" : major,
        items: value.filter((item) => item.key !== "Hide")
      });
    });
    return groups;
  }, [songTypes]);

  const [selectedKeys, setSelectedKeys] = useState(new Set(["All Songs"]));

  useEffect(() => {
    if (selectedKeys.size === 1) {
      const selectedKey = Array.from(selectedKeys)[0];

      onSelectionChange(selectedKey);
    }
  }, [selectedKeys, onSelectionChange]);

  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure();
  const { isOpen: isExportListOpen, onOpen: onExportListOpen, onClose: onExportListClose } = useDisclosure();
  const [importFavoriteInput, setImportFavoriteInput] = useState("");
  const dispatch = useDispatch();

  const collection = useSelector(selectCollection);
  const exportFavorite = () => {
    return `WannaFavorite:${collection.join(",")}`;
  };
  const exportFavoriteAsHumanReadableList = () => {
    const favSongs = collection
      .map((id) => findSongById(songTypes, id))
      .filter((song) => song !== null);
    const favList = favSongs.map(s => `${s!!.id}. ${s!!.composedTitle}`);
    return favList.join("\n");
  }
  const importFavorite = (input: string) => {
    const [prefix, ids] = input.trim().split(":");
    if (prefix.trim() === "WannaFavorite") {
      const idsArray = ids.trim().split(",");
      const idsSet = new Set(idsArray.map((id) => parseInt(id.trim())));
      idsSet.forEach((id) => {
        if (!collection.includes(id)) {
          dispatch(addCollection(id));
        }
      });
    }
  };

  const handleDropdownAction = (key: Key) => {
    switch (key) {
      case "import-favorite":
        onImportOpen();
        break;
      case "export-favorite":
        onExportOpen();
        break;
      case "export-favorite-list":
        onExportListOpen();
        break;
      default:
        break;
    }
  };

  const makeGroupItem = (item: { key: string; label: string }) => {
    return (
      <ListboxItem
        key={item.key}
        hideSelectedIcon
        className={`${styles.customListboxItem}`}
      >
        {item.key === "Favorites" ? (
          <div className={`${styles.favoriteRow}`}>
            {item.label}
            <Dropdown>
              <DropdownTrigger>
                <span><ExportIcon size={18} /></span>
              </DropdownTrigger>
              <DropdownMenu variant="light" hideSelectedIcon onAction={(e) => handleDropdownAction(e)}>
                <DropdownItem key="export-favorite">导出收藏</DropdownItem>
                <DropdownItem key="import-favorite">导入收藏</DropdownItem>
                <DropdownItem key="export-favorite-list">导出歌曲列表</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        ) : item.label}
      </ListboxItem>
    );
  };

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
        <ScrollShadow hideScrollBar className="w-[11.5vw] h-[798px]">
          <Accordion
            selectionMode={"multiple"}
            isCompact={true}
            defaultExpandedKeys={songTypeOptions.map((x) => x.major)}
            className={styles.accordion}
            itemClasses={{
              base: `${styles.accordionItem}`,
              title: `${styles.accordionTitle} font-bold text-sm`
            }}
          >
            {songTypeOptions.map((group) => (
              <AccordionItem
                key={group.major}
                title={group.major}
                aria-label={group.major}
              >
                <Listbox
                  aria-label="songType"
                  classNames={{
                    base: `${styles.listbox}`
                  }}
                  items={group.items}
                  selectedKeys={selectedKeys}
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    if (keys instanceof Set && keys.size > 0) {
                      setSelectedKeys(keys as Set<string>);
                    }
                  }}
                >
                  {makeGroupItem}
                </Listbox>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollShadow>
      )}
      <Modal
        size="md"
        isOpen={isExportOpen}
        onClose={onExportClose}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">导出收藏</ModalHeader>
              <ModalBody>
                <Textarea
                  isReadOnly
                  label="歌曲收藏"
                  variant="bordered"
                  labelPlacement="outside"
                  defaultValue={exportFavorite()}
                  className="max-w-full"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={() => navigator.clipboard.writeText(exportFavorite())}>
                  复制到剪贴板
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        size="md"
        isOpen={isImportOpen}
        onClose={onImportClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">导入收藏</ModalHeader>
              <ModalBody>
                <Textarea
                  label="歌曲收藏"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="请粘贴收藏内容"
                  className="max-w-full"
                  value={importFavoriteInput}
                  onValueChange={setImportFavoriteInput}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose} onClick={() => importFavorite(importFavoriteInput)}>
                  导入
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        size="md"
        isOpen={isExportListOpen}
        onClose={onExportListClose}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">导出歌曲列表</ModalHeader>
              <ModalBody>
                <Textarea
                  isReadOnly
                  label="歌曲列表"
                  variant="bordered"
                  labelPlacement="outside"
                  defaultValue={exportFavoriteAsHumanReadableList()}
                  className="max-w-full"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={() => navigator.clipboard.writeText(exportFavoriteAsHumanReadableList())}>
                  复制到剪贴板
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
