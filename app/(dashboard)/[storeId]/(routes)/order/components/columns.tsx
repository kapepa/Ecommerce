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
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "createAt",
    header: "Date",
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => <OrderAction order={row.original}/>
  },
]