"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { BoardColor } from "@/components/ui/board-color"
 
export type CategoryColumn = {
  id: string
  url: string
  name: string
  billboardLabel: string
  createdAt: string
}
 
export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Имя",
  },
  {
    accessorKey: "billboard",
    header: "Рекламный щит этикетка",
    cell: ({ row }) => row.original.billboardLabel,
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