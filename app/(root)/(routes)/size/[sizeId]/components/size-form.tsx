"use client"

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { sizeSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface SizeFormProps {
  initialData: Size | null
}

const SizeForm: FC<SizeFormProps> = (props) => {
  const { initialData } = props;
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const title = !!initialData ? "Изменить размер." : "Создать размер.";
  const description = !!initialData ? "Редактирование размера." : "Добавить новый размер.";
  const toastSuccessMessage = !!initialData ? "Размер обновлен." : "Размер создан";
  const btnLabel = !!initialData ? "Сохранить изменения" : "Создать";

  const form = useForm<z.infer<typeof sizeSchema>>({
    resolver: zodResolver(sizeSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  })
 
  function onSubmit(values: z.infer<typeof sizeSchema>) {
    startTransition(async () => {
      try {
        if(!!initialData) {
          await axios.patch(`/api/size/${params.sizeId}`, values)
        } else {
          await axios.post(`/api/size`, values)
        }
        toast.success(toastSuccessMessage);
        router.push(`/size`);
      } catch (error) {
        toast.error("Что-то пошло не так.");
      } finally {
        setOpen(false)
        router.refresh()
      }
    })
  }

  function onDelete() {
    startTransition(async () => {
      try {
        await axios.delete(`/api/size/${params.sizeId}`);
        toast.success("Размер удален.");
        router.push(`/size`)
      } catch (error) {
        toast.error("Сначала убедитесь, что вы удалили все продукты, использующие этот размер.");
      } finally {
        setOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={isPending}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
        {
          !!initialData && 
          <Button
            disabled={isPending}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash/>
          </Button>
        }
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className=" grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      disabled={isPending}
                      placeholder="Название размера" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Значение</FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      disabled={isPending}
                      placeholder="Значение размера" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button 
            disabled={isPending}
            type="submit"
          >
            {btnLabel}
          </Button>
        </form>
      </Form>
    </>
  )
}

export { SizeForm }