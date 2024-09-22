"use client"

import { useState, useMemo, useEffect, useRef, Component } from "react"
import TableItem from "./components/tableItem"
import styles from "./index.module.css"

import { Video } from "@/types/ayaInfo"
import { ScrollShadow } from "@nextui-org/react"

interface SongTableProps {
  targetData: Video[]
  loading: boolean
}

export default function SongTable({ targetData, loading }: SongTableProps) {
  console.log(targetData)
  const [page, setPage] = useState(1)
  const rowsPerPage = 12

  const pages = Math.ceil(targetData.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return targetData.slice(start, end)
  }, [page, targetData])
  const loadingState = loading || targetData?.length === 0 ? "loading" : "idle"
  return (
    <div className={styles.table}>
      <ScrollShadow className="w-full h-[690px]" hideScrollBar>
        <TableItem />
      </ScrollShadow>
    </div>
  )
}
