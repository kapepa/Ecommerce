"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { BoardColor } from "@/components/ui/board-color"
import { formatter } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export type ProductColumn = {
  id: string
  ruName: string
  uaName: string
  ruDescription: string
  uaDescription: string
  price: number
  isFeatured: boolean
  isArchived: boolean
  category: string
  size: string
  color: string
  createAt: string
}
 
export const columns: ColumnDef<ProductColumn>[] = [
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
    accessorKey: "isFeatured",
    header: "Особенность",
    cell: ({ row }) => (
      <>
        {
          row.original.isFeatured && (
            <Badge variant="success">
              Отображается
            </Badge>
          )
        }
                {
          !row.original.isFeatured && (
            <Badge variant="secondary">
              Скрыт
            </Badge>
          )
        }
      </>
    )

  },
  {
    accessorKey: "isArchived",
    header: "Архивировано",
    cell: ({ row }) => (
      <>
        {
          row.original.isArchived && (
            <Badge variant="success">
              В Архиве
            </Badge>
          )
        }
        {
          !row.original.isArchived && (
            <Badge variant="secondary">
              Не в Архиве
            </Badge>
          )
        }
      </>
    )
  },
  {
    accessorKey: "price",
    header: "Цена",
    cell: ({ row }) => (
      <>
        {formatter.format(Number(row.original.price))}
      </>
    )
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
    header: "Дата",
  },
  {
    header: "Действие",
    id: "action",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]