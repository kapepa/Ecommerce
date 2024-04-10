"use client"

import { FC } from "react";
import { ColorColumn, columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { ApiList } from "@/components/ui/api-list";

interface ColorClientProps {
  data: ColorColumn[];
}

const ColorClient: FC<ColorClientProps> = (props) => {
  const { data } = props;
  const route = useRouter();
  const params = useParams();

  return (
    <>
      <div
        className="flex items-center justify-between"
      >
        <Heading
          title={`Colors ${data.length}`}
          description="Manage color for your store"
        />
        <Button
          onClick={() => { route.push(`/${params.storeId}/color/new`) }}
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
        description="API calls for color"
      />
      <Separator/>
      <ApiList
        entityId="colorId"
        entityName="color"
      />
    </>
  )
}

export { ColorClient }