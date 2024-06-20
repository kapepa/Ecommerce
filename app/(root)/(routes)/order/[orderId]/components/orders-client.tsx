"use client"

import { FC, useLayoutEffect, useState, useTransition } from "react";
import { ProductOrder, columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

interface OrderClientProps {
  orderId: string,
  data: ProductOrder[],
}

const OrdersClient: FC<OrderClientProps> = (props) => {
  const { orderId, data } = props;
  const router = useRouter();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition()

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null;

  const onDeleteOrderById = () => {
    startTransition(() => {
      fetch(`/api/order/${orderId}`, { method: "DELETE" })
        .then(() => {
          toast.success("Заказ был успешно удален")
          router.push("/order")
        })
        .catch(() => {
          toast.error("Что то пошло не так")
        })
    })
  }
  
  return (
    <>
      <div
        className="flex items-center justify-between"
      >
        <Heading
          title="Заказ"
          description="Обзор заказа"
        />
        <Button
          disabled={isPending}
          variant="destructive"
          size="sm"
          onClick={() => setOpenAlert(true)}
        >
          <Trash/>
        </Button>
      </div>
      <Separator/>
      <DataTable
        columns={columns}
        data={data}
      />
      <AlertModal
        isOpen={openAlert}
        loading={isPending}
        onClose={() => setOpenAlert(false)}
        onConfirm={onDeleteOrderById}
      />
    </>
  )
}

export { OrdersClient }