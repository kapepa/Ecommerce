"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
 
export type CategoryColumn = {
  id: string
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
    accessorKey: "createdAt",
    header: "Дата",
  },
  {
    id: "actions",
    header: "Действия",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]