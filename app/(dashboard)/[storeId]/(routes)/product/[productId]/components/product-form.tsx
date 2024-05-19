"use client"

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useState, useTransition } from "react";
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
  const { initialData, categories, sizes, colors } = props;
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const title = !!initialData ? "Edit product." : "Create product.";
  const description = !!initialData ? "Edit a product." : "Add a new product.";
  const toastSuccessMessage = !!initialData ? "Product updated." : "Product created";
  const btnLabel = !!initialData ? "Save changes" : "Create";

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: !!initialData 
    ? {
        ...initialData,
        price: parseFloat(String(initialData.price))
      } 
    : {
        name: "",
        price: 0,
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
          await axios.patch(`/api/${params.storeId}/product/${params.productId}`, values)
        } else {
          await axios.post(`/api/${params.storeId}/product`, values)
        }
        toast.success(toastSuccessMessage);
        router.push(`/${params.storeId}/product`);
      } catch (error) {
        toast.error("Something went wrong.");
      } finally {
        setOpen(false)
        router.refresh()
      }
    })
  }

  const onDelete = () => {
    startTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/product/${params.productId}`)
        toast.success("Product deleted.");
        router.push(`/${params.storeId}/product`)
      } catch (error) {
        toast.error("Something went wrong.")
      } finally {
        setOpen(false);
        router.refresh();
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      disabled={isPending}
                      value={ field.value.map(img => img.url) }
                      onChange={ (url) => {
                        field.onChange([...form.getValues("image"), { url }])
                      } }
                      onRemove={ (url) => {
                        const filter = field.value.filter(img => img.url !== url);
                        field.onChange(filter);
                      } }
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      disabled={isPending}
                      placeholder="Product name" 
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
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      disabled={isPending}
                      placeholder="Product price" 
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
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
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
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
                  <FormLabel>Size</FormLabel>
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
                          placeholder="Select a size"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map(size => (
                        <SelectItem
                          key={size.id}
                          value={size.id}
                        >
                          {size.name}
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
                    className="flex flex-ia gap-x-6 items-end"
                  >
                    <div
                      className="grow-[1]"
                    >
                      <FormLabel>Color</FormLabel>
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
                              placeholder="Select a color"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          { colors.map(color => (
                              <SelectItem
                                key={color.id}
                                value={color.id}
                              >
                                {color.name}
                              </SelectItem>
                          )) }
                        </SelectContent>
                      </Select>
                    </div>
                    <FormDescription
                      className="h-10 w-10 rounded-full border"
                      style={{ backgroundColor: `${colors.find(color => color.id === form.getValues("colorId"))?.value}` }}
                    />
                  </div>
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
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This product will appear on the home page.
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
                      Archived
                    </FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in store.
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