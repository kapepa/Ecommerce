"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"
import { BoardColor } from "@/components/ui/board-color"

export type BillboardColumn = {
  id: string,
  ruLabel: string,
  uaLabel: string,
  active: boolean,
  imageUrl: string,
  createAt: string,
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    header: "Этикетка RU",
    accessorKey: "ruLabel",
    cell: ({ row }) => (
      <p
        className="overflow-hidden truncate max-w-32"
      >
        {row.original.ruLabel}
      </p>
    ),
  },
  {
    header: "Этикетка UA",
    accessorKey: "uaLabel",
    cell: ({ row }) => (
      <p
        className="overflow-hidden truncate max-w-32"
      >
        {row.original.uaLabel}
      </p>
    ),
  },
  {
    header: "Изображение",
    accessorKey: "imageUrl",
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
    header: "Дата",
    accessorKey: "createAt",
  },
  {
    id: "actions",
    header: "Действия",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
