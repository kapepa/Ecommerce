"use client"

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getImageId } from "@/lib/utils";
import { billboardSchema } from "@/schema";
import { useImagesStore } from "@/store/images";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useLayoutEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface BillboardFormProps {
  initialData: Billboard | null,
}

const BillboardForm: FC<BillboardFormProps> = (prosp) => {
  const { initialData } = prosp;
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const { usedUrls, loadedUrls, initImagesUrls, setLoadedUrl, clearAllImg, deleteloadedUrl } = useImagesStore();

  const title = !!initialData ? "Редактировать рекламный щит." : "Создать рекламный щит.";
  const description = !!initialData ? "Редактирование рекламного щита." : "Добавить новый рекламный щит.";
  const soastSuccessMessage = !!initialData ? "Обновленный рекламного щита." : "Созданный рекламный щит.";
  const btnLabel = !!initialData ? "Сохранить изменения" : "Создать";

  useLayoutEffect(() => {
    initImagesUrls( !!initialData?.imageUrl ? [initialData?.imageUrl] : [] );
  }, [initialData?.imageUrl, initImagesUrls])

  useLayoutEffect(() => {
    return () => {
      if (!!loadedUrls.length) axios.post(`/api/image/billboard/cleaner`, loadedUrls);
    }
  }, [loadedUrls])

  const form = useForm<z.infer<typeof billboardSchema>>({
    resolver: zodResolver(billboardSchema),
    defaultValues: 
      initialData ?? 
      {
        ruLabel: "",
        uaLabel: "",
        active: false,
        imageUrl: "",
      },
  });

  function onSubmit(values: z.infer<typeof billboardSchema>) {
    startTransition(async () => {
      try {
        if(!!initialData) {
          await axios.patch(`/api/billboard/${params.billboardId}`, values);
        } else {
          await axios.post(`/api/billboard`, values);
        }
        const clearUrls = loadedUrls.concat(usedUrls).filter(url => url !== values.imageUrl);
        if (!!clearUrls.length) await axios.post(`/api/image/delete`,clearUrls);
        
        clearAllImg();
        toast.success(soastSuccessMessage);
        router.push(`/billboard`);
      } catch (err) {
        toast.error("Что-то пошло не так.");
      } finally {
        setOpen(false)
        router.refresh();
      }
    })
  };


  function onDeleteBillboard() {
    startTransition(async () => {
      try {
        await axios.delete(`/api/billboard/${params.billboardId}`);
        toast.success("Биллборд удален.");
        router.push(`/billboard`);
      } catch (err) {
        toast.error("Сначала убедитесь, что вы удалили все категории, использующие этот рекламный щит.");
      } finally {
        setOpen(false)
        router.refresh();
      }
    })
  }

  const onDeleteOneImage = (url: string) => {
    startTransition(async () => {
      const publicId = getImageId(url);
      await axios.delete(`/api/image/billboard/${publicId}`)
      .then(() => {
        deleteloadedUrl(url);
        form.setValue("imageUrl", "");
      });
    })
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={isPending}
        onClose={() => setOpen(false)}
        onConfirm={onDeleteBillboard}
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фоновое изображение</FormLabel>
                  <FormControl>
                    <ImageUpload
                      disabled={isPending}
                      value={ !!field.value ? [field.value] : [] }
                      onDeleteImage={onDeleteOneImage}
                      onChange={(url) => {
                        setLoadedUrl(url);
                        field.onChange(url);
                      }}
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
              name="active"
              render={({ field }) => (
                <FormItem
                  className="flex flex-col"
                >
                  <FormLabel>Активировать</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                      aria-readonly
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
              name="ruLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Этикетка RU</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={isPending}
                      placeholder="Этикетка на рекламном щите Ru" 
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
              name="uaLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Этикетка UA</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={isPending}
                      placeholder="Этикетка на рекламном щите UA" 
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

export { BillboardForm };