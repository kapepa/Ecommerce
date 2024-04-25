"use client"

import { ColorPicker } from "@/components/color-picker";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { colorSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useState, useTransition } from "react";
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

  const title = !!initialData ? "Edit color." : "Create color.";
  const description = !!initialData ? "Edit a color." : "Add a new color.";
  const toastSuccessMessage = !!initialData ? "Color updated." : "Color created";
  const btnLabel = !!initialData ? "Save changes" : "Create";

  const form = useForm<z.infer<typeof colorSchema>>({
    resolver: zodResolver(colorSchema),
    defaultValues: initialData ?? {
      name: "",
      value: "",
    },
  })

  function onSubmit(values: z.infer<typeof colorSchema>) {
    startTransition(async() => {
      try {
        if (!!initialData) {
          await axios.patch(`/api/${params.storeId}/color/${params.colorId}`, values);
        } else {
          await axios.post(`/api/${params.storeId}/color`, values)
        }
        toast.success(toastSuccessMessage)
        router.push(`/${params.storeId}/color`)
      } catch (error) {
        toast.error("Something went wrong.");
      } finally {
        setOpen(false)
        router.refresh();
      }
    })
    
  }

  function onDelete() {
    startTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/color/${params.colorId}`);
        toast.success("Color deleted.");
        router.push(`/${params.storeId}/color`)
      } catch (error) {
        toast.error("Make sure you removed all products using this color first.");
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
                      placeholder="Color name" 
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
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div
                      className="flex items-center gap-x-4"
                    >
                      <Input 
                        disabled={isPending}
                        placeholder="Size value" 
                        {...field} 
                      />
                      <ColorPicker
                        value={field.value}
                        onChange={field.onChange}
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