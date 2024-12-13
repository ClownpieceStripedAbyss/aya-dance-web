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
import { addCustomList } from "@/store/modules/customListStore"
import { AppDispatch } from "@/store"

export interface ModalRef {
  onOpen: () => void
}

const AddCustomListModal = forwardRef<ModalRef>((props, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useDispatch<AppDispatch>()
  useImperativeHandle(ref, () => ({
    onOpen,
  }))
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  function handleAddCustomList() {
    if (name === "") {
      toast.warn("歌单名称不能为空")
      return
    }

    dispatch(addCustomList({ name, description, ids: [] }))
    toast.success("歌单添加成功")
    onClose()
    setName("")
    setDescription("")
  }

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">新增歌单</ModalHeader>
            <ModalBody>
              <Input label="歌单名称" onValueChange={setName} maxLength={12} />
              <Textarea
                label="歌单描述"
                variant="bordered"
                labelPlacement="outside"
                className="max-w-full"
                onValueChange={setDescription}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                取消
              </Button>
              <Button
                color="primary"
                onPress={onClose}
                onClick={handleAddCustomList}
              >
                确认
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
})

export default AddCustomListModal
