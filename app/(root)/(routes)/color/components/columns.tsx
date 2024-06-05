"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import Image from "next/image"
import { BoardColor } from "@/components/ui/board-color"
 
export type ColorColumn = {
  id: string
  url: string
  name: string
  createdAt: string
}
 
export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Значение",
    cell: ({ row }) => (
      <div
        className="flex items-center gap-x-2"
      >
        <BoardColor
          url={row.original.url}
        />
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Дата",
  },
  {
    id: "Действия",
    header: "Дата",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]