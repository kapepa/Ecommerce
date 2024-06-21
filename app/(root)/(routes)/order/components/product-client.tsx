"use client"

import { FC, useState, useTransition } from "react";
import { OrderColumns, columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { useRouter } from "next/navigation";

interface OrderClientProps {
  data: OrderColumns[],
}

const OrderClient: FC<OrderClientProps> = (props) => {
  const { data } = props;
  const router = useRouter();
  const [isAlert, setAlert] = useState<boolean>(false);
  const [changeOrder, setChangeorder] = useState<{id: string, checked: boolean}>();
  const [isPending, startTransition] = useTransition();

  const callbackDone = () => {
    if (!!changeOrder?.id) {
      startTransition(() => {
        fetch(`/api/order/${changeOrder.id}`, { method: "PATCH", body: JSON.stringify({ isDone: changeOrder.checked }) })
        .then(() => {
          toast.success("Статус заказа успешно обновлен")
          setAlert(false);
          router.refresh();
        })
      })
    }
  }

  const onChangeIsDone = (id: string, checked: boolean) => {
    setAlert(true)
    setChangeorder({id, checked})
  }

  return (
    <>
      <div
        className="flex items-center justify-between"
      >
        <Heading
          title={`Заказы (${data.length})`}
          description="Управление заказами для вашего магазина"
        />
      </div>
      <Separator/>
      <DataTable
        data={data}
        disabled={isPending}
        columns={columns}
        onChangeIsDone={onChangeIsDone}
        searchKey="products"
      />
      <AlertModal
        isOpen={isAlert}
        loading={isPending}
        onClose={() => {setAlert(false)}}
        onConfirm={callbackDone}
      />
    </>
  )
}

export { OrderClient }