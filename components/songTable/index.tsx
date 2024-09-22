"use client";

import { Key, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete, AutocompleteItem, Pagination, ScrollShadow } from "@nextui-org/react";

import TableItem from "./components/tableItem";
import styles from "./index.module.css";

import { SortBy, Video } from "@/types/ayaInfo";
import { selectSongInfo, setSortBy } from "@/store/modules/songInfo";

interface SongTableProps {
  targetData: Video[];
  loading: boolean;
  targetKey: string;
}

export default function SongTable({
  targetData,
  loading,
  targetKey,
}: SongTableProps) {
  const dispatch = useDispatch();
  const { SortBy: SortByValue } = useSelector(selectSongInfo);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("20"); // 初始值为 20
  const pageOptions = [
    { value: "10", label: "10 首/页" },
    { value: "20", label: "20 首/页" },
    { value: "50", label: "50 首/页" },
    { value: "100", label: "100 首/页" },
  ];
  const numRowsPerPage = Number(rowsPerPage);
  const pages = Math.ceil(targetData.length / numRowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * numRowsPerPage;
    const end = start + numRowsPerPage;

    return targetData.slice(start, end);
  }, [page, numRowsPerPage, targetData]);

  useEffect(() => {
    setPage(1);
  }, [numRowsPerPage, targetData]);

  // sort
  const sortOptions = [
    { value: `${SortBy.ID_ASC}`, label: "ID 升序" },
    { value: `${SortBy.ID_DESC}`, label: "ID 降序" },
    { value: `${SortBy.TITLE_ASC}`, label: "标题升序" },
    { value: `${SortBy.TITLE_DESC}`, label: "标题降序" },
  ];

  return (
    <div className={styles.table}>
      <div
        className="font-bold text-l text-primary mb-4 leading-snug">{`${targetData.length} Videos in ${targetKey}`}</div>
      <ScrollShadow hideScrollBar className="w-full h-[680px]">
        {items.map((item, index) => (
          <TableItem key={index} song={item} />
        ))}
      </ScrollShadow>
      <div className={styles.bottom}>
        <div className={styles.paginationControl}>
          <Autocomplete
            aria-label="change rows per page"
            className="w-[130px]"
            defaultItems={pageOptions}
            isClearable={false}
            selectedKey={rowsPerPage}
            onSelectionChange={setRowsPerPage as (key: Key | null) => void}
          >
            {pageOptions.map((option) => (
              <AutocompleteItem key={option.value} value={option.value}>
                {option.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Autocomplete
            aria-label="change rows per slot"
            className="w-[130px] ml-4"
            defaultItems={sortOptions}
            isClearable={false}
            selectedKey={`${SortByValue}`}
            onSelectionChange={(key) => {
              if (key !== null) {
                dispatch(setSortBy(Number(key) as SortBy));
              }
            }}
          >
            {sortOptions.map((option) => (
              <AutocompleteItem key={option.value} value={option.value}>
                {option.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    </div>
  );
}
