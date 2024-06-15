import { FC, useState, useTransition } from "react";
import { CategoryColumn } from "./columns";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { AlertModal } from "@/components/modals/alert-modal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

interface CellActionProps {
  data: CategoryColumn
}

const CellAction: FC<CellActionProps> = ( props ) => {
  const { data } = props;
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const onRouterTo = () => {
    router.push(`/categories/${data.id}`)
  }

  function onDelete() {
    startTransition( async () => {
      try {
        await axios.delete(`/api/category/${data.id}`);
        router.refresh();
        toast.success("Категория удалена.");
      } catch (err) {
        toast.error("Сначала убедитесь, что вы удалили все, использующие эту категорию.");
      } finally {
        setOpen(false)
      }
    })
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={isPending}
        onConfirm={onDelete}
        onClose={() => setOpen(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
        >
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span
              className="sr-only"
            >
              Открыть меню
            </span>
            <MoreHorizontal
              className="h-4 w-4"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Действия
          </DropdownMenuLabel>
          <DropdownMenuItem
            disabled={isPending}
            onClick={onRouterTo.bind(null)}
          >
            <Edit
              className="mr-2 h-4 w-4"
            />
            Обновление
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => setOpen(true)}
          >
            <Trash
              className="mr-2 h-4 w-4"
            />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export { CellAction }