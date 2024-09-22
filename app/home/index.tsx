"use client"

import React from "react"
import { useState } from "react"
import { fetchAyaVideoIndex } from "@/servers/udon-dance"

import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/listbox"

export default function HomeBlock() {
  const [count, setCount] = useState(0)

  fetchAyaVideoIndex()
  return (
    <section className="flex flex-row items-center justify-left gap-4 py-4 md:py-4 h-full">
      <Listbox aria-label="Actions" onAction={(key) => alert(key)}>
        <ListboxItem key="new">New file</ListboxItem>
        <ListboxItem key="copy">Copy link</ListboxItem>
        <ListboxItem key="edit">Edit file</ListboxItem>
        <ListboxItem key="delete" className="text-danger" color="danger">
          Delete file
        </ListboxItem>
      </Listbox>
    </section>
  )
}
