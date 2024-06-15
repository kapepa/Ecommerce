"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type SizeColumn = {
  id: string
  ruName: string
  uaName: string
  value: string
  createdAt: string
}

export const columns: ColumnDef<SizeColumn>[] = [
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
    accessorKey: "value",
    header: "Значение",
  },
  {
    accessorKey: "createdAt",
    header: "Дата",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
