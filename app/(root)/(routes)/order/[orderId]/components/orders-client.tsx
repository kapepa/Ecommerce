"use client"

import { FC, useLayoutEffect, useRef, useState, useTransition } from "react";
import { ProductOrder, columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { Switch } from "@/components/ui/switch";

interface OrderClientProps {
  orderId: string,
  isDone: boolean,
  data: ProductOrder[],
}

const OrdersClient: FC<OrderClientProps> = (props) => {
  const callbaack = useRef(() => {});
  const { orderId, data, isDone } = props;
  const router = useRouter();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [changeOrder, setChangeorder] = useState<{id: string, checked: boolean}>();

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

  const onChangeIsDone = () => {
    if (!!changeOrder?.id) {
      startTransition(() => {
        fetch(`/api/order/${changeOrder.id}`, { method: "PATCH", body: JSON.stringify({ isDone: changeOrder.checked }) })
        .then(() => {
          toast.success("Статус заказа успешно обновлен")
          setOpenAlert(true)
          router.refresh();
        })
      })
    }
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
        <div
          className="flex items-center gap-x-4"
        >
          <div
            className="flex items-center gap-x-4"
          >
            <span
              className="text-sm text-muted-foreground"
            >
              Выполнено
            </span>
            <Switch
              checked={isDone}
              disabled={isPending}
              onCheckedChange={(checked: boolean) => {
                setOpenAlert(true)
                setChangeorder({id: orderId, checked})
                callbaack.current = onChangeIsDone
              }}
            />
          </div>
          <Button
            disabled={isPending}
            variant="destructive"
            size="sm"
            onClick={() => {
              setOpenAlert(true)
              callbaack.current = onDeleteOrderById
            }}
          >
            <Trash/>
          </Button>
        </div>
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
        onConfirm={callbaack.current}
      />
    </>
  )
}

export { OrdersClient }