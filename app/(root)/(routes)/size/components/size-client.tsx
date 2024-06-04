"use client"

import { FC } from "react"
import { SizeColumn, columns } from "./columns";
import { useParams, useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";

interface SizeClientProps {
  data: SizeColumn[]
}

const SizeClient: FC<SizeClientProps> = (props) => {
  const { data } = props;
  const router = useRouter();

  return (
    <>
      <div
        className="flex items-center justify-between"
      >
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage size for your store"
        />
        <Button
          onClick={() => router.push(`/size/new`)}
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

export { SizeClient }