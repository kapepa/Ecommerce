import { FC, useState, useTransition } from "react";
import { OrderColumns } from "./columns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { useRouter } from "next/navigation";
import axios from "axios";


interface OrderActionProps {
  order: OrderColumns,
}

const OrderAction: FC<OrderActionProps> = (props) => {
  const { order } = props;
  const router = useRouter();
  const [ open, setOpen ] = useState<boolean>(false);
  const [ isPending, startTransition ] = useTransition()

  const onDeleteOrderById = () => {
    startTransition( async () => {
      try {
        await axios.delete(`/api/order/${order.id}`);
        toast.success("Заказ был успешно удален.")
      } catch ( error ) {
        toast.error("Что-то пошло не так при удалении заказа.")
      } finally {
        setOpen(false);
        router.refresh();
      }
    })
  }

  return (
    <>
      <AlertModal
        loading={isPending}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDeleteOrderById}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Открыть меню</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Действия</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => setOpen(true)}
          >
            Удалить заказ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export { OrderAction }