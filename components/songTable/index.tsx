"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react"
import styles from "./index.module.css"
import { Category } from "@/types/ayaInfo"

interface SongTableProps {
  songTypes: Category[]
  loading: boolean
  selectedKeys: string
}

export default function SongTypeSelector({
  songTypes,
  loading,
}: SongTableProps) {
  return (
    <>
      <div>111</div>
    </>
  )
}
