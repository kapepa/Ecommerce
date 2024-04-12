"use client"

import { Plus } from "lucide-react";
import { FC } from "react";
import { CategoryColumn, columns } from "./columns";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { ApiList } from "@/components/ui/api-list";
import { Heading } from "@/components/ui/heading";


interface CategoriesClientProps {
  data: CategoryColumn[]
}

const CategoriesClient: FC<CategoriesClientProps> = (props) => {
  const { data } = props;
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div
        className="flex items-center justify-between"
      >
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
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
        description="API calls for at categories"
      />
      <Separator/>
      <ApiList
        entityId="categoryId"
        entityName="categories"
      />
    </>
  )
}

export { CategoriesClient }