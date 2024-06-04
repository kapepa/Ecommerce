"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { BoardColor } from "@/components/ui/board-color"

export type ProductColumn = {
  id: string
  name: string
  price: string
  isFeatured: boolean
  isArchived: boolean
  category: string
  size: string
  color: string
  createAt: string
}
 
export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Имя",
  },
  {
    accessorKey: "isArchived",
    header: "Архивировано",
  },
  {
    accessorKey: "isFeatured",
    header: "Особенность",
  },
  {
    accessorKey: "price",
    header: "Цена",
  },
  {
    accessorKey: "category",
    header: "Категория",
  },
  {
    accessorKey: "size",
    header: "Размер",
  },
  {
    accessorKey: "color",
    header: "Цвет",
    cell: ({ row }) => (
      <div
        className="flex items-center gap-x-2"
      >
        <BoardColor
          url={row.original.color}
        />
      </div>
    )
  },
  {
    accessorKey: "createAt",
    header: "Date",
  },
  {
    id: "action",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]