"use client"

// components/AddCustomListModal.tsx
import React, { forwardRef, useImperativeHandle, useState } from "react"
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { addCustomList, editCustomList } from "@/store/modules/customListStore"
import { AppDispatch } from "@/store"

export interface ModalRef {
  onOpen: (formModel?: {
    name: string
    description: string
    ids: string
  }) => void
}

const AddEditCustomListModal = forwardRef<ModalRef>((_, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isEdit, setIsEdit] = useState(false)
  const [originName, setOriginName] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  useImperativeHandle(ref, () => ({
    onOpen: (formModel) => {
      console.log(formModel)
      // 判空
      if (!!formModel) {
        setIsEdit(true)
        setName(formModel.name)
        setOriginName(formModel.name)
        setDescription(formModel.description)
        setIds(formModel.ids)
      }
      onOpen()
    },
  }))
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [ids, setIds] = useState("")
  function handleAddCustomList() {
    if (name === "") {
      toast.warn("歌单名称不能为空")
      return
    }
    const target = {
      name,
      description,
      ids: Array.from(
        new Set(
          ids
            .split(",")
            .filter(Boolean)
            .map((id) => Number(id))
        )
      ),
      originName,
    }
    if (isEdit) {
      dispatch(editCustomList(target))
      toast.success("歌单修改成功")
      return close()
    }
    dispatch(addCustomList(target))
    toast.success("歌单添加成功")
    close()
  }
  function close() {
    console.log("close")
    setIsEdit(false)
    onClose()
    setIds("")
    setName("")
    setOriginName("")
    setDescription("")
  }

  return (
    <Modal size="md" isOpen={isOpen} onClose={close}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isEdit ? "修改歌单" : "新增歌单"}
            </ModalHeader>
            <ModalBody>
              <Input
                label="歌单名称"
                value={name}
                onValueChange={setName}
                maxLength={12}
              />
              <Textarea
                label="歌单描述"
                variant="bordered"
                labelPlacement="outside"
                className="max-w-full"
                value={description}
                onValueChange={setDescription}
              />
              <Textarea
                label="id 列表"
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
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={close}>
                取消
              </Button>
              <Button color="primary" onClick={handleAddCustomList}>
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
