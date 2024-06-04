"use client"

import { FC } from "react";
import { ProductColumn, columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { Separator } from "@/components/ui/separator";

interface ProductClientProps {
  data: ProductColumn[],
}

const ProductClient: FC<ProductClientProps> = (props) => {
  const { data } = props;
  const router = useRouter();

  return (
    <>
      <div
        className="flex items-center justify-between"
      >
        <Heading
          title={`Продукция (${data.length})`}
          description="Управление товарами для вашего магазина"
        />
        <Button
          onClick={() => router.push(`/product/new`)}
        >
          <Plus
            className="h-4 w-4"
          />
          Добавить новый
        </Button>
      </div>
      <Separator/>
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
      />
      <Separator/>
    </>
  )
}

export { ProductClient }