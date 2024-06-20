"use client"

import { FC, useTransition } from "react";
import { OrderColumns, columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import toast from "react-hot-toast";

interface OrderClientProps {
  data: OrderColumns[],
}

const OrderClient: FC<OrderClientProps> = (props) => {
  const { data } = props;
  const [isPending, startTransition] = useTransition()

  const onChangeIsDone = (id: string, checked: boolean) => {
    startTransition(() => {
      fetch(`/api/order/${id}`, { method: "PATCH", body: JSON.stringify({ isDone: checked }) })
      .then((res) => {

        toast.success("Статус заказа успешно обновлен")
      })
    })
  }

  return (
    <>
      <div
        className="flex items-center justify-between"
      >
        <Heading
          title={`Заказы (${data.length})`}
          description="Управление заказами для вашего магазина"
        />
      </div>
      <Separator/>
      <DataTable
        data={data}
        disabled={isPending}
        columns={columns}
        onChangeIsDone={onChangeIsDone}
        searchKey="products"
      />
    </>
  )
}

export { OrderClient }