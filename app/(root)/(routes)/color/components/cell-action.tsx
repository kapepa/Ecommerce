"use client"

import { FC, useState, useTransition } from "react";
import { ColorColumn } from "./columns";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

interface CellActionProps {
  data: ColorColumn,
}

const CellAction: FC<CellActionProps> = (props) => {
  const { data } = props;
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // const onCopy = (text: string) => {
  //   navigator.clipboard.writeText(text);
  //   toast.success("Color id copied to the clipboard")
  // }

  const onRouterTo = () => {
    router.push(`/color/${data.id}`)
  }

  const onDelete = () => {
    startTransition(async () => {
      try {
        await axios.delete(`/api/color/${data.id}`);
        router.refresh()
        toast.success("Цвет удален.")
      } catch (error) {
        toast.error("Сначала убедитесь, что вы удалили все категории, использующие этот цвет.");
      } finally {
        setOpen(false);
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

export { CellAction };