"use client"

import { FC, useState, useTransition } from "react";
import { ProductColumn } from "./columns";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import toast from "react-hot-toast";
import axios from "axios";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";


interface CellActionProps {
  data: ProductColumn
}

const CellAction: FC<CellActionProps> = (props) => {
  const { data } = props;
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Product id copied to the clipboard")
  }

  const onRouterTo = () => {
    router.push(`/${params.storeId}/product/${data.id}`)
  }

  const onDelete = () => {
    startTransition(async () => {
      try {
        await axios.delete(`/${params.storeId}/product/${data.id}`);
        router.refresh();
        toast.error("Product was succe delete");
      } catch (error) {
        toast.error("Something went wrong");
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
              Open menu
            </span>
            <MoreHorizontal
              className="h-4 w-4"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem
            disabled={isPending}
            onClick={onRouterTo.bind(null)}
          >
            <Edit
              className="mr-2 h-4 w-4"
            />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            onClick={onCopy.bind(null, data.id)}
          >
            <Copy
              className="mr-2 h-4 w-4"
            />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => setOpen(true)}
          >
            <Trash
              className="mr-2 h-4 w-4"
            />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export { CellAction }