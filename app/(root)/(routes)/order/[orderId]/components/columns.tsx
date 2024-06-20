"use client"

import { BoardColor } from "@/components/ui/board-color"
import { formatter } from "@/lib/utils"
import { Image, Product } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { LinkProduct } from "./link-product"

type ProductType = Pick<Product, "id" | "ruName" >
type ImageType = Pick<Image, "id" | "url">

export type ProductOrder = ProductType & { price: Number, image: ImageType[]}

export const columns: ColumnDef<ProductOrder>[] = [
  {
    accessorKey: "ruName",
    header: "Название",
  },
  {
    accessorKey: "image",
    header: "Изображение",
    cell: ({ row }) => (
      <div
        className="flex items-center gap-x-2"
      >
        <BoardColor
          url={row.original.image[0].url}
        />
      </div>
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
    header: "Открыть страницу",
    cell: ({ row }) => (
      <LinkProduct
        id={row.original.id}
      />
    )
  }
]
