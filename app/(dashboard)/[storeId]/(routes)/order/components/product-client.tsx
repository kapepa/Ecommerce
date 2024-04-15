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
          title={`Orders (${data.length})`}
          description="Manage orders for your store"
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