"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"
import { BoardColor } from "@/components/ui/board-color"

export type BillboardColumn = {
  id: string,
  label: string,
  active: boolean,
  imageUrl: string,
  createAt: string,
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Этикетка",
  },
  {
    accessorKey: "imageUrl",
    header: "Изображение",
    cell: ({ row }) => (
      <div
      className="flex items-center gap-x-2"
    >
      <BoardColor
        url={row.original.imageUrl}
      />
    </div>
    ),
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
    accessorKey: "createAt",
    header: "Дата",
  },
  {
    id: "actions",
    header: "Действия",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
