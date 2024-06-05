"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"

export type BillboardColumn = {
  id: string,
  label: string,
  active: boolean,
  createAt: string,
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Этикетка",
  },
  {
    accessorKey: "createAt",
    header: "Дата",
  },
  {
    header: "Активный",
    cell: ({ row }) => (
      <>
        {
          row.original.active && (
            <Badge
              variant="success"
            >
              On
            </Badge>
          )
        }
        {
          !row.original.active && (
            <Badge
              variant="secondary"
            >
              Off
            </Badge>
          )
        }
      </>
    )
  },
  {
    id: "actions",
    header: "Действия",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
