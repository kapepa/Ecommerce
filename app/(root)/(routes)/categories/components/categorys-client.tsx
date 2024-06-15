"use client"

import { Plus } from "lucide-react";
import { FC } from "react";
import { CategoryColumn, columns } from "./columns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { Heading } from "@/components/ui/heading";


interface CategoriesClientProps {
  data: CategoryColumn[]
}

const CategoriesClient: FC<CategoriesClientProps> = (props) => {
  const { data } = props;
  const router = useRouter();

  return (
    <>
      <div
        className="flex items-center justify-between"
      >
        <Heading
          title={`Категории (${data.length})`}
          description="Управление категориями для вашего магазина"
        />
        <Button
          onClick={() => router.push(`/categories/new`)}
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
        searchKey={["ruName", "uaName"]}
      />
      <Separator/>
    </>
  )
}

export { CategoriesClient }