"use client"

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { FC, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-modal";

const SettingsFrom: FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const onClearImages = () => {
    startTransition(() => {
      fetch("/api/image/garbage",{
        method: "DELETE",
      })
      .then(() => {
        toast.success("Очистка изображений прошла успешно.");
      })
      .catch(() => {
        toast.error("Что-то пошло не так при удалении мусора.");
      })
      .finally(() => {
        setOpen(false)
      })
    })
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={isPending}
        onClose={() => setOpen(false)}
        onConfirm={onClearImages}
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Настройки"
          description="Управление работой магазина"
        />
      </div>
      <Separator/>
      <div
        className="grid grid-flow-row grid-rows-1 gap-y-2"
      >
        <div>
          <p
            className="text-sm text-muted-foreground"
          >
            Очистите неиспользуемые изображения
          </p>
        </div>
        <div>
          <Button
            disabled={isPending}
            onClick={setOpen.bind(null, true)}
          >
            Очистить
          </Button>
        </div>
      </div>
      <Separator/>   
    </>
  )
}

export { SettingsFrom }