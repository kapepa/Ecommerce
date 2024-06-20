import { ColumnDef } from "@tanstack/react-table"
import { OrderAction } from "./order-action"
import { ToggleDone } from "./toggle-done"

export type OrderColumns = {
  id: string,
  phone: string,
  address: string,
  isDone: boolean,
  products: string,
  totalPrice: string,
  createAt: string
}
 
export const columns: ColumnDef<OrderColumns>[] = [
  {
    accessorKey: "products",
    header: "Продукция",
    cell: ({ row }) => (
      <p
        className="overflow-hidden truncate max-w-32"
      >
        {row.original.products}
      </p>
    ),
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
    accessorKey: "isDone",
    header: "Выполнено",
    cell: ({ row, table }) => (
      <ToggleDone
        value={row.original.isDone}
        disabled={(table.options.meta as {disabled: boolean}).disabled}
        onChangeIsDone={(value) => {
          (table.options.meta as {onChangeIsDone: (id: string, val: boolean) => void}).onChangeIsDone(row.original.id,  value)
        }}
      />
    ),
  },
  {
    accessorKey: "createAt",
    header: "Дата",
  },
  {
    accessorKey: "actions",
    header: "Действие",
    cell: ({ row }) => (
      <OrderAction order={row.original}/>
    )
  },
]