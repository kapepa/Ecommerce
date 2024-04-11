"use client"

import { FC } from "react";
import { ProductColumn, columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { DataTable } from "./data-table";
import { ApiList } from "@/components/ui/api-list";

interface ProductClientProps {
  data: ProductColumn[],
}

const ProductClient: FC<ProductClientProps> = (props) => {
  const { data } = props;
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div
        className="flex items-center justify-between"
      >
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/product/new`)}
        >
          <Plus
            className="h-4 w-4"
          />
          Add New
        </Button>
      </div>
      <Separator/>
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
      />
      <Separator/>
      <Heading 
        title="API"
        description="API calls for products"
      />
      <Separator/>
      <ApiList
        entityId="productId"
        entityName="product"
      />
    </>
  )
}

export { ProductClient }