"use client"

import { Key, useEffect, useMemo, useRef, useState } from "react"
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
  useDisclosure,
} from "@nextui-org/react"

import styles from "./index.module.css"
import {
  findSongById,
  GenericVideoGroup,
  GROUP_ALL_SONGS,
  GROUP_FAVORITE,
} from "@/types/video"
import { Button } from "@nextui-org/button"
import { useDispatch, useSelector } from "react-redux"
import { addCollection, selectCollection } from "@/store/modules/collection"
import { ExportIcon, MoreIcon, Star } from "@/assets/icon"
import AddCustomListModal, {
  ModalRef as AddCustomListModalRef,
} from "./components/AddEditCustomListModal"
import {
  deleteCustomList,
  selectCustomListStore,
} from "@/store/modules/customPlaylist"
import ExportCustom, {
  ModalRef as ExportCustomModalRef,
} from "./components/ExportCustom"
import MakeDropdown from "@/components/makeDropdown"

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

    option.push({ key: GROUP_FAVORITE, label: "喜欢的歌曲", major: "" })

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

  const [selectedKeys, setSelectedKeys] = useState(new Set([GROUP_ALL_SONGS]))

  useEffect(() => {
    if (selectedKeys.size !== 1) return
    const selectedKey = Array.from(selectedKeys)[0]
    onSelectionChange(selectedKey, customListStore.names.has(selectedKey))
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
        exportCustomList(value || "")
        break
      case "make-custom-list":
        handleAddCustomList()
        break
      case "export-custom-list":
        // TODO 导入歌单 空函数
        handleExportCustomList()
        break
      default:
        break
    }
  }

  // 新增歌单
  const addModalRef = useRef<AddCustomListModalRef>(null)
  function handleAddCustomList() {
    addModalRef.current?.onOpen()
  }
  // 修改歌单
  function handleEditCustomList(name: string) {
    const target = customListStore.content.find((item) => item.name === name)
    console.log(target, "target")
    addModalRef.current?.onOpen({
      name: target?.name || "",
      description: target?.description || "",
      ids: target?.ids.join(",") || "",
    })
  }
  // 导入歌单
  function handleExportCustomList() {}
  // 导出歌单
  const exportModalRef = useRef<ExportCustomModalRef>(null)
  function exportCustomList(name: string) {
    exportModalRef.current?.onOpen(name)
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
              case GROUP_ALL_SONGS:
                return item.label
              case GROUP_FAVORITE:
                return (
                  <div className={`${styles.favoriteRow}`}>
                    {item.label}
                    <MakeDropdown
                      items={[
                        { key: "export-favorite", label: "导出收藏" },
                        { key: "import-favorite", label: "导入收藏" },
                        { key: "export-favorite-list", label: "导出歌曲列表" },
                      ]}
                      onAction={(key) => handleDropdownAction(key)}
                      icon={
                        <ExportIcon className="w-4 h-4 text-black dark:text-white" />
                      }
                    />
                  </div>
                )
              default:
                // 自定义歌单
                return (
                  <div className={`${styles.favoriteRow}`}>
                    {item.label}
                    <MakeDropdown
                      items={[
                        { key: "custom-delete", label: "删除歌单" },
                        { key: "custom-edit", label: "修改歌单" },
                        { key: "custom-export", label: "导出歌单" },
                      ]}
                      onAction={(key) => handleDropdownAction(key, item.key)}
                    />
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
  // 展开自定义歌单功能 位于 À la carte
  const makeAccordionTitle = (major: string) => {
    if (major === CARTE) {
      return (
        <div className="flex justify-between align-middle">
          <div className="flex items-center">{CARTE}</div>
          <MakeDropdown
            items={[
              { key: "make-custom-list", label: "新增歌单" },
              { key: "export-custom-list", label: "导入歌单" },
            ]}
            onAction={(key) => handleDropdownAction(key)}
            icon={<Star className="w-4 h-4 text-black dark:text-white" />}
          />
        </div>
      )
    }

    return major
  }

  const makeSongTypeOptions = () => {
    return songTypeOptions.map((group) => (
      <AccordionItem
        key={group.major}
        title={makeAccordionTitle(group.major)}
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
            if (keys instanceof Set && keys.size > 0) {
              setSelectedKeys(keys as Set<string>)
            }
          }}
        >
          {(item) => makeGroupItem(item, group.major)}
        </Listbox>
      </AccordionItem>
    ))
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
            {makeSongTypeOptions()}
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
      <AddCustomListModal ref={addModalRef} />
      <ExportCustom ref={exportModalRef} />
    </>
  )
}
