"use client";

// components/AddCustomListModal.tsx
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createCustomList, editCustomList } from "@/store/modules/customPlaylist";
import { AppDispatch } from "@/store";
import { isBuiltinGroup } from "@/types/video";
import { CustomPlayList, EditCustomPlayList } from "@/types/customPlayList";

export interface ModalRef {
  onOpen: (
    formModel?: {
      name: string
      description: string
      danceIds: string
    },
    isImportBool?: boolean
  ) => void
}

const AddEditCustomListModal = forwardRef<ModalRef>((_, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isEdit, setIsEdit] = useState(false)
  const [originName, setOriginName] = useState("")
  const [isImport, setIsImport] = useState(false)
  const [customStr, setCustomStr] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  useImperativeHandle(ref, () => ({
    onOpen: (formModel, isImportBool) => {
      if (isImportBool) {
        // 导入歌单
        setIsImport(true)
      } else if (!!formModel) {
        setIsEdit(true)
        setName(formModel.name)
        setOriginName(formModel.name)
        setDescription(formModel.description)
        setIds(formModel.danceIds)
        setIsImport(false)
      }
      // 新增
      onOpen()
    },
  }))
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [ids, setIds] = useState("")
  function handleSubmit() {
    if (name === "") {
      toast.warning("歌单名称不能为空")
      return
    }
    if (isBuiltinGroup(name)) {
      toast.warning("歌单名称不能为内置名称")
      return
    }
    const target = {
      name,
      description,
      danceIds: Array.from(
        new Set(
          ids
            .split(",")
            .filter(Boolean)
            .map((id) => Number(id))
        )
      )
    } as CustomPlayList
    if (isEdit) return editSubmit({
      edited: target,
      originName: originName,
    } as EditCustomPlayList)
    addSubmit(target)
  }
  function addSubmit(target: CustomPlayList) {
    dispatch(createCustomList(target))
    toast.success("歌单添加成功")
    close()
  }

  function editSubmit(target: EditCustomPlayList) {
    dispatch(editCustomList(target))
    toast.success("歌单修改成功")
    close()
  }

  function handleImportSubmit() {
    if (!customStr.startsWith("WannaShare:")) {
      toast.warning(`请输入符合标准的歌单内容 例如 "WannaShare:{...}"`)
      return
    }

    // only split into 2 parts
    const cleanStr = customStr.split("WannaShare:")[1]
    const sharedCustom: CustomPlayList = JSON.parse(cleanStr)

    dispatch(
      createCustomList(sharedCustom)
    )
    toast.success("歌单添加成功")
    close()
  }

  function close() {
    setIsEdit(false)
    onClose()
    setIds("")
    setName("")
    setOriginName("")
    setDescription("")
    setIsImport(false)
    setCustomStr("")
  }

  return (
    <Modal size="md" isOpen={isOpen} onClose={close}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isEdit ? "修改歌单" : isImport ? "导入歌单" : "新增歌单"}
            </ModalHeader>
            <ModalBody>
              {isImport ? (
                <Textarea
                  label="请粘贴歌单内容"
                  variant="bordered"
                  labelPlacement="outside"
                  className="max-w-full mb-2"
                  placeholder={`格式例如: WannaShare:{...}`}
                  onValueChange={(value) => {
                    setCustomStr(value)
                  }}
                />
              ) : (
                <>
                  <Input
                    label="歌单名称"
                    value={name}
                    onValueChange={setName}
                    maxLength={12}
                  />
                  <Textarea
                    label="歌单描述(可选)"
                    variant="bordered"
                    labelPlacement="outside"
                    className="max-w-full"
                    value={description}
                    onValueChange={setDescription}
                  />
                  <Textarea
                    label="id 列表(可选)"
                    placeholder="id 列表，以逗号分隔"
                    variant="bordered"
                    labelPlacement="outside"
                    className="max-w-full"
                    value={ids}
                    onValueChange={(value) => {
                      const filtered = value
                      .replace(/，/g, ",")
                      .replace(/\s+/g, "")
                      .replace(/[^0-9,]/g, "")
                      .replace(/,+/g, ",")
                      setIds(filtered)
                    }}
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={close}>
                取消
              </Button>
              <Button color="primary" onClick={isImport ? handleImportSubmit : handleSubmit}>
                确认
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
})

export default AddEditCustomListModal
