"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { FC } from "react"
import { BillboardColumn, columns } from "./columns"
import { DataTable } from "./data-table"

interface BillboardClientProps {
  data: BillboardColumn[]
}

const BillboardClient: FC<BillboardClientProps> = (props) => {
  const { data } = props;
  const router = useRouter();

  return (
    <>
      <div
        className="flex items-center justify-between"
      >
        <Heading
          title={`Рекламный щит (${data.length})`}
          description="Управляйте рекламными щитами для вашего магазина"
        />
        <Button
          onClick={() => router.push(`/billboard/new`)}
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
        searchKey={["ruLabel", "uaLabel"]}
      />
      <Separator/>
    </>
  )
}

export { BillboardClient }