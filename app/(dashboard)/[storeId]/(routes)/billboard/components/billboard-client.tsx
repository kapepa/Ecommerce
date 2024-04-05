"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { FC } from "react"

const BillboardClient: FC = () => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div
        className="flex items-center justify-between"
      >
        <Heading
          title="Billboard (0)"
          description="Manage billboard for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboard/new`)}
        >
          <Plus
            className="h-4 w-4"
          />
          Add New
        </Button>
      </div>
      <Separator/>
    </>
  )
}

export { BillboardClient }