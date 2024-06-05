import { ColumnDef } from "@tanstack/react-table"
import { OrderAction } from "./order-action"

export type OrderColumns = {
  id: string,
  phone: string,
  address: string,
  isPaid: boolean,
  products: string,
  totalPrice: string,
  createAt: string
}
 
export const columns: ColumnDef<OrderColumns>[] = [
  {
    accessorKey: "products",
    header: "Продукция",
  },
  {
    accessorKey: "phone",
    header: "Телефон",
  },
  {
    accessorKey: "address",
    header: "Адрес",
  },
  {
    accessorKey: "totalPrice",
    header: "Общая цена",
  },
  {
    accessorKey: "isPaid",
    header: "Оплачивается",
  },
  {
    accessorKey: "createAt",
    header: "Дата",
  },
  {
    accessorKey: "actions",
    header: "Действие",
    cell: ({ row }) => <OrderAction order={row.original}/>
  },
]