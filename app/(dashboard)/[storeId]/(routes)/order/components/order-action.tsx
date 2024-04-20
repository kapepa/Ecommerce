import { FC, useState, useTransition } from "react";
import { OrderColumns } from "./columns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";


interface OrderActionProps {
  order: OrderColumns,
}

const OrderAction: FC<OrderActionProps> = (props) => {
  const { order } = props;
  const router = useRouter();
  const params = useParams()
  const [ open, setOpen ] = useState<boolean>(false);
  const [ isPending, startTransition ] = useTransition()

  const onDeleteOrderById = () => {
    startTransition( async () => {
      try {
        await axios.delete(`/api/${params.storeId}/order/${order.id}`);
        toast.success("The order was successfully deleted.")
      } catch ( error ) {
        toast.error("Something went wrong while deleting order.")
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
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => setOpen(true)}
          >
            Delete order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export { OrderAction }