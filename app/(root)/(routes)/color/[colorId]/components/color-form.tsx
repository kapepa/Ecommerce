"use client"

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { ColorUpload } from "@/components/ui/color-upload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { getImageId } from "@/lib/utils";
import { colorSchema } from "@/schema";
import { useImagesStore } from "@/store/images";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useLayoutEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ColorFormProps {
  initialData: Color | null,
}

const ColorForm: FC<ColorFormProps> = (props) => {
  const { initialData } = props;
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const { usedUrls, loadedUrls, initImagesUrls, setLoadedUrl, clearAllImg, deleteloadedUrl } = useImagesStore();

  const title = !!initialData ? "Редактировать цвет." : "Создайте цвет.";
  const description = !!initialData ? "Редактирование цвета." : "Добавьте новый цвет.";
  const toastSuccessMessage = !!initialData ? "Обновленный цвет." : "Созданный цвет.";
  const btnLabel = !!initialData ? "Сохранить изменения" : "Создать";

  useLayoutEffect(() => {
    initImagesUrls( !!initialData?.url ? [initialData?.url] : [] );
  }, [initialData?.url, initImagesUrls])

  useLayoutEffect(() => {
    return () => {
      if (loadedUrls.length) axios.post(`/api/image/delete`, loadedUrls);
    }
  }, [loadedUrls])

  const form = useForm<z.infer<typeof colorSchema>>({
    resolver: zodResolver(colorSchema),
    defaultValues: initialData ?? {
      url: "",
      name: "",
    },
  })


  function onSubmit(values: z.infer<typeof colorSchema>) {
    startTransition(async() => {
      try {
        if (!!initialData) {
          await axios.patch(`/api/color/${params.colorId}`, values);
        } else {
          await axios.post(`/api/color`, values)
        }
        const clearUrls = loadedUrls.concat(usedUrls).filter(url => url !== values.url);
        if (!!clearUrls.length) await axios.post(`/api/image/delete`,clearUrls);

        clearAllImg();
        toast.success(toastSuccessMessage)
        router.push(`/color`)
      } catch (error) {
        toast.error("Что-то пошло не так.");
      } finally {
        setOpen(false)
        router.refresh();
      }
    })
    
  }

  function onDelete() {
    startTransition(async () => {
      try {
        await axios.delete(`/api/color/${params.colorId}`);
        toast.success("Color deleted.");
        router.push(`/color`)
      } catch (error) {
        toast.error("Сначала убедитесь, что вы удалили все продукты, использующие этот цвет.");
      } finally {
        setOpen(false)
        router.refresh();
      }
    })
  }

  function onDeleteColorImage(url: string) {
    const isLoaded = loadedUrls.some(url => usedUrls.includes(url));

    startTransition(async () => {
      if (isLoaded) {
        const publicId = getImageId(url);
        await axios.delete(`/api/image/color/${publicId}`)
        .then(() => deleteloadedUrl(url));
      }

      if (!isLoaded) {
        await axios.post(`/api/image/delete`,[url])
        .then(() => deleteloadedUrl(url));
      }

      form.setValue("url", "");
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
                      disabled={isPending}
                      placeholder="Название цвета" 
                      type="text"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Загрузка цвета</FormLabel>
                  <FormControl>
                    <div
                      className="flex items-center gap-x-4"
                    >
                      <ColorUpload
                        disabled={isPending}
                        value={field.value}
                        onDeleteColor={onDeleteColorImage}
                        onChange={(url) => {
                          setLoadedUrl(url);
                          field.onChange(url);
                        }}
                      />
                    </div>
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

export { ColorForm };