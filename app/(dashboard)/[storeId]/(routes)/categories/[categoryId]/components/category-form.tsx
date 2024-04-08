"use client"

import { FC, useState, useTransition } from "react";
import { Billboard, Category } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { categorySchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFormProps {
  initialData: Category | null,
  billboards: Billboard[] | null,
}

const CategoryForm: FC<CategoryFormProps> = (props) => {
  const { initialData, billboards } = props;
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState<boolean>(false); 
  const [isPending, startTransition] = useTransition();

  const title = !!initialData ? "Edit category." : "Create category.";
  const description = !!initialData ? "Edit a category." : "Add a new category.";
  const soastSuccessMessage = !!initialData ? "Category updated." : "Category created";
  const btnLabel = !!initialData ? "Save changes" : "Create";

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      name: "",
      billboardId: ""
    },
  })

  function onSubmit(values: z.infer<typeof categorySchema>) {
    startTransition(async () => {
      try {
        if(!!initialData) {
          await axios.patch(`/api/${params.storeId}/category/${params.categoryId}`, values);
        } else {
          await axios.post(`/api/${params.storeId}/category`, values);
        }
        toast.success(soastSuccessMessage);
        router.push(`/${params.storeId}/categories`)
      } catch (err) {
        toast.error("Something went wrong.");
      } finally {
        setOpen(false)
        router.refresh();
      }
    })
  };

  function onDelete() {
    startTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/category/${params.categoryId}`);
        router.push(`/${params.storeId}/categories`);
        toast.success("Category deleted.");
      } catch (err) {
        toast.error("Make sure you removed all products using this category first.");
      } finally {
        setOpen(false)
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Category name" 
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
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select 
                    disabled={isPending}
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue 
                          placeholder="Select a verified email to display" 
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!!billboards && billboards.map((billboard, index) => (
                        <SelectItem 
                          key={`${billboard.id}-${index}`}
                          value={billboard.label}
                        >
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export { CategoryForm }