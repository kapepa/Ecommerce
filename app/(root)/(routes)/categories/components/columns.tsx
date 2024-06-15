"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { BoardColor } from "@/components/ui/board-color"
 
export type CategoryColumn = {
  id: string
  url: string
  ruName: string
  uaName: string
  createdAt: string
}
 
export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "ruName",
    header: "Имя RU",
    cell: ({ row }) => (
      <p
        className="overflow-hidden truncate max-w-32"
      >
        {row.original.ruName}
      </p>
    ),
  },
  {
    accessorKey: "uaName",
    header: "Имя UA",
    cell: ({ row }) => (
      <p
        className="overflow-hidden truncate max-w-32"
      >
        {row.original.uaName}
      </p>
    ),
  },
  {
    accessorKey: "url",
    header: "Изображение категории",
    cell: ({ row }) => (
      <div
      className="flex items-center gap-x-2"
    >
      <BoardColor
        url={row.original.url}
      />
    </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Дата",
  },
  {
    id: "actions",
    header: "Действия",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]