"use client"

import { FC } from "react";
import { OrderColumns, columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";

interface OrderClientProps {
  data: OrderColumns[],
}

const OrderClient: FC<OrderClientProps> = (props) => {
  const { data } = props;

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
        columns={columns}
        data={data}
        searchKey="products"
      />
    </>
  )
}

export { OrderClient }