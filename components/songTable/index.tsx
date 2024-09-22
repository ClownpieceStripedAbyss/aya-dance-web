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

interface SongTableProps {
  categories: { title: string }[]
  loading: boolean
}

export default function SongTypeSelector({
  categories,
  loading,
}: SongTableProps) {
  return <></>
}
