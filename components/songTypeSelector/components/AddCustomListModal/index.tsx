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
interface AddEditCustomListModalProps {
  isEdit: boolean;

}
const AddEditCustomListModal = forwardRef<ModalRef,AddEditCustomListModalProps>((props, ref) => {
  const { isEdit } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useDispatch<AppDispatch>()
  useImperativeHandle(ref, () => ({
    onOpen,
  })) 
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [ids, setIds] = useState("")
  function handleAddCustomList() {
    if (name === "") {
      toast.warn("歌单名称不能为空")
      return
    }

    dispatch(
      addCustomList({
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
      })
    )
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
                  setIds(filtered)
                }}
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

export default AddEditCustomListModal
