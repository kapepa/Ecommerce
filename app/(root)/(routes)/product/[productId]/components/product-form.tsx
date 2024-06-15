"use client"

import { AlertModal } from "@/components/modals/alert-modal";
import { BoardColor } from "@/components/ui/board-color";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getImageId } from "@/lib/utils";
import { productSchema } from "@/schema";
import { useImagesStore } from "@/store/images";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useLayoutEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ProductFormProps {
  initialData: Product & { image: Image[] } | null,
  categories: Category[],
  sizes: Size[],
  colors: Color[],
}

const ProductForm: FC<ProductFormProps> = (props) => {
  const { initialData, categories, sizes, colors,  } = props;
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const { usedUrls, loadedUrls, initImagesUrls, setLoadedUrl, clearAllImg, deleteloadedUrl } = useImagesStore();

  const title = !!initialData ? "Редактировать продукт." : "Создать продукт.";
  const description = !!initialData ? "Редактировать продукт." : "Добавить новый продукт.";
  const toastSuccessMessage = !!initialData ? "Обновленный продукт." : "Созданный продукт";
  const btnLabel = !!initialData ? "Сохранить изменения" : "Создать";

  useLayoutEffect(() => {
    initImagesUrls( !!initialData?.image ? initialData?.image.map(img => img.url) : [] );
  }, [initialData?.image, initImagesUrls])

  useLayoutEffect(() => {
    return () => {
      if (!!loadedUrls.length) axios.post(`/api/image/product/cleaner`, loadedUrls);
    }
  }, [loadedUrls])

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: !!initialData 
    ? {
        ...initialData,
        price: parseFloat(String(initialData.price))
      } 
    : {
        ruName: "",
        uaName: "",
        ruDescription: "",
        uaDescription: "",
        price: 0,
        meta: "",
        isFeatured: true,
        isArchived: false,
        categoryId: "",
        sizeId: "",
        colorId: "",
        image: [],
      },
  })

  function onSubmit(values: z.infer<typeof productSchema>) {
    startTransition(async () => {
      try {
        if(!!initialData) {
          await axios.patch(`/api/product/${params.productId}`, values)
        } else {
          await axios.post(`/api/product`, values)
        }
        const clearUrls = loadedUrls.concat(usedUrls).filter(url => !values.image.some(img => img.url === url));
        if (!!clearUrls.length) await axios.post(`/api/image/delete`,clearUrls);
        
        clearAllImg();
        toast.success(toastSuccessMessage);
        router.push(`/product`);
      } catch (error) {
        toast.error("Что-то пошло не так.");
      } finally {
        setOpen(false)
        router.refresh()
      }
    })
  }

  const onDeleteProduct = () => {
    startTransition(async () => {
      try {
        await axios.delete(`/api/product/${params.productId}`)
        toast.success("Продукт удален.");
        router.push(`/product`)
      } catch (error) {
        toast.error("Что-то пошло не так.")
      } finally {
        setOpen(false);
        router.refresh();
      }
    })
  }

  const onDeleteOneImage = async (url: string) => {
    const publicId = getImageId(url);
    await axios.delete(`/api/image/product/${publicId}`)
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={isPending}
        onClose={() => setOpen(false)}
        onConfirm={onDeleteProduct}
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изображения</FormLabel>
                  <FormControl>
                    <ImageUpload
                      disabled={isPending}
                      value={ field.value.map(img => img.url) }
                      onDeleteImage={ (url) => {
                        startTransition(async () => {
                          await onDeleteOneImage(url)
                          .then(() => {
                            deleteloadedUrl(url);
                            const filter = field.value.filter(img => img.url !== url);
                            field.onChange(filter);
                          });
                        })
                      } }
                      onChange={ (url) => {
                        field.onChange([...form.getValues("image"), { url }])
                        setLoadedUrl(url);
                      } }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="meta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Метаданные</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Мета здесь"
                      className="resize-none"
                      disabled={isPending}
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
              name="ruName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя RU</FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      disabled={isPending}
                      placeholder="Название продукта" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="uaName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя UA</FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      disabled={isPending}
                      placeholder="Название продукта" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      disabled={isPending}
                      placeholder="Цена продукта" 
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange} 
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Выберите категорию"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.ruName ?? category.uaName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Размер</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={(data) => {
                      field.onChange(data)
                    }} 
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Выберите размер"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map(size => (
                        <SelectItem
                          key={size.id}
                          value={size.id}
                        >
                          {size.ruName ?? size.uaName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem> 
                  <div
                    className="flex flex-ia gap-x-6 items-end h-full"
                  >
                    <div
                      className="grow-[1]"
                    >
                      <FormLabel>Цвет</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange} 
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Выберите цвет"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          { colors.map(color => (
                              <SelectItem
                                key={color.id}
                                value={color.id}
                              >
                                {color.ruName ?? color.uaName}
                              </SelectItem>
                          )) }
                        </SelectContent>
                      </Select>
                    </div>
                    <FormDescription>
                      <BoardColor
                        url={colors.find(color => color.id === form.getValues("colorId"))?.url || ""}
                      />
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div
            className="flex flex-col gap-y-4"
          >
            <FormField
              control={form.control}
              name="ruDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание RU</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Опишите здесь RU"
                      className="resize-none"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="uaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание UA</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Опишите здесь UA"
                      className="resize-none"
                      disabled={isPending}
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
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Особенность
                    </FormLabel>
                    <FormDescription>
                      Этот продукт появится на главной странице.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Архивировано
                    </FormLabel>
                    <FormDescription>
                      Этот товар не появится нигде в магазине.
                    </FormDescription>
                  </div>
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

export { ProductForm };