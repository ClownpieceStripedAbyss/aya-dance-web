"use client";

import { Key, useEffect, useMemo, useRef, useState } from "react";
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
import { ExportIcon, MoreIcon } from "@/assets/icon";
import AddCustomListModal, { ModalRef } from "./components/AddEditCustomListModal";
import { deleteCustomList, exportCustomList, selectCustomListStore } from "@/store/modules/customPlaylist";

// À la carte
const CARTE = "À la carte"
interface SongTypeSelectorProps {
  songTypes: GenericVideoGroup[]
  loading: boolean
  onSelectionChange: (selectedKey: string, isCustom: boolean) => void
}

function groupBy<K, V>(array: V[], grouper: (item: V) => K) {
  return array.reduce((store: Map<K, V[]>, item) => {
    var key = grouper(item)
    if (!store.has(key)) {
      store.set(key, [item])
    } else {
      store.get(key)!!.push(item)
    }
    return store
  }, new Map<K, V[]>())
}

export default function SongTypeSelector({
  songTypes,
  loading,
  onSelectionChange,
}: SongTypeSelectorProps) {
  const customListStore = useSelector(selectCustomListStore)
  const songTypeOptions = useMemo(() => {
    const option = songTypes.map((group: GenericVideoGroup) => {
      return {
        key: group.title,
        label: group.title,
        major: group.major,
      }
    })

    // 添加 收藏 和 新增歌单 选项 与 自定义歌单展示选项

    option.push({ key: "Favorites", label: "喜欢的歌曲", major: "" })
    option.push({ key: "CustomList", label: "新增歌单", major: "" })

    customListStore.content.forEach((list) => {
      option.push({ key: list.name, label: list.name, major: "" })
    })

    let groups: {
      major: string
      items: { key: string; label: string }[]
    }[] = []
    groupBy(option, (item) => item.major).forEach((value, major) => {
      groups.push({
        major: major === "" ? CARTE : major,
        items: value.filter((item) => item.key !== "Hide"),
      })
    })
    return groups
  }, [songTypes, customListStore])

  const [selectedKeys, setSelectedKeys] = useState(new Set(["All Songs"]))

  useEffect(() => {
    if (selectedKeys.size !== 1) return
    const selectedKey = Array.from(selectedKeys)[0]

    const specialCategories = new Set(["CustomList", "Favorites", "All Songs"])

    if (specialCategories.has(selectedKey)) {
      onSelectionChange(selectedKey, false)
      return
    }

    const isCarte = customListStore.names.has(selectedKey)

    onSelectionChange(selectedKey, isCarte)
  }, [selectedKeys])

  const {
    isOpen: isExportOpen,
    onOpen: onExportOpen,
    onClose: onExportClose,
  } = useDisclosure()
  const {
    isOpen: isImportOpen,
    onOpen: onImportOpen,
    onClose: onImportClose,
  } = useDisclosure()
  const {
    isOpen: isExportListOpen,
    onOpen: onExportListOpen,
    onClose: onExportListClose,
  } = useDisclosure()
  const [importFavoriteInput, setImportFavoriteInput] = useState("")
  const dispatch = useDispatch()

  const collection = useSelector(selectCollection)
  const exportFavorite = () => {
    return `WannaFavorite:${collection.join(",")}`
  }
  const exportFavoriteAsHumanReadableList = () => {
    const favSongs = collection
      .map((id) => findSongById(songTypes, id))
      .filter((song) => song !== null)
    const favList = favSongs.map((s) => `${s!!.id}. ${s!!.composedTitle}`)
    return favList.join("\n")
  }
  const importFavorite = (input: string) => {
    const [prefix, ids] = input.trim().split(":")
    if (prefix.trim() === "WannaFavorite") {
      const idsArray = ids.trim().split(",")
      const idsSet = new Set(idsArray.map((id) => parseInt(id.trim())))
      idsSet.forEach((id) => {
        if (!collection.includes(id)) {
          dispatch(addCollection(id))
        }
      })
    }
  }

  const handleDropdownAction = (key: Key, value?: string) => {
    console.log(key, value)
    switch (key) {
      case "import-favorite":
        onImportOpen()
        break
      case "export-favorite":
        onExportOpen()
        break
      case "export-favorite-list":
        onExportListOpen()
        break
      case "custom-delete":
        dispatch(deleteCustomList(value))
        break
      case "custom-edit":
        handleEditCustomList(value || "")
        break
      case "custom-export":
        dispatch(exportCustomList(value))
        break
      default:
        break
    }
  }

  // 新增歌单
  const modalRef = useRef<ModalRef>(null)
  function handleAddCustomList() {
    modalRef.current?.onOpen()
  }
  // 修改歌单
  function handleEditCustomList(name: string) {
    const target = customListStore.content.find((item) => item.name === name)
    console.log(target, "target")
    modalRef.current?.onOpen({
      name: target?.name || "",
      description: target?.description || "",
      ids: target?.ids.join(",") || "",
    })
  }

  const makeGroupItem = (
    item: {
      key: string
      label: string
    },
    major: string
  ) => {
    return (
      <ListboxItem
        key={item.key}
        hideSelectedIcon
        className={`${styles.customListboxItem}`}
      >
        {(() => {
          if (major === CARTE) {
            switch (item.key) {
              case "All Songs":
                return item.label
              case "Favorites":
                return (
                  <div className={`${styles.favoriteRow}`}>
                    {item.label}
                    <Dropdown>
                      <DropdownTrigger>
                        <span>
                          <ExportIcon size={18} />
                        </span>
                      </DropdownTrigger>
                      <DropdownMenu
                        variant="light"
                        hideSelectedIcon
                        onAction={(e) => handleDropdownAction(e)}
                      >
                        <DropdownItem key="export-favorite">
                          导出收藏
                        </DropdownItem>
                        <DropdownItem key="import-favorite">
                          导入收藏
                        </DropdownItem>
                        <DropdownItem key="export-favorite-list">
                          导出歌曲列表
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                )
              case "CustomList":
                return <div onClick={handleAddCustomList}>{item.label}</div>
              default:
                // 自定义歌单
                return (
                  <div className={`${styles.favoriteRow}`}>
                    {item.label}
                    <Dropdown>
                      <DropdownTrigger>
                        <span>
                          <MoreIcon size={18} />
                        </span>
                      </DropdownTrigger>
                      <DropdownMenu
                        variant="light"
                        hideSelectedIcon
                        onAction={(e) => handleDropdownAction(e, item.key)}
                      >
                        <DropdownItem key="custom-delete">
                          删除歌单
                        </DropdownItem>
                        <DropdownItem key="custom-edit">修改歌单</DropdownItem>
                        <DropdownItem key="custom-export">
                          导出歌单
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                )
            }
          } else {
            return item.label
          }
        })()}
      </ListboxItem>
    )
  }

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
              title: `${styles.accordionTitle} font-bold text-sm`,
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
                    base: `${styles.listbox}`,
                  }}
                  items={group.items}
                  selectedKeys={selectedKeys}
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    keys = keys as Set<string>
                    if (keys.has("CustomList")) {
                      return
                    }
                    if (keys instanceof Set && keys.size > 0) {
                      setSelectedKeys(keys as Set<string>)
                    }
                  }}
                >
                  {(item) => makeGroupItem(item, group.major)}
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
              <ModalHeader className="flex flex-col gap-1">
                导出收藏
              </ModalHeader>
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
                  onClick={() =>
                    navigator.clipboard.writeText(exportFavorite())
                  }
                >
                  复制到剪贴板
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal size="md" isOpen={isImportOpen} onClose={onImportClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                导入收藏
              </ModalHeader>
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
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={() => importFavorite(importFavoriteInput)}
                >
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
              <ModalHeader className="flex flex-col gap-1">
                导出歌曲列表
              </ModalHeader>
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
                  onClick={() =>
                    navigator.clipboard.writeText(
                      exportFavoriteAsHumanReadableList()
                    )
                  }
                >
                  复制到剪贴板
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <AddCustomListModal ref={modalRef} />
    </>
  )
}
