"use client"

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { FC, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { settingsSchema } from "@/schema";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ApiAlert } from "@/components/ui/api-alert";
import { AlertModal } from "@/components/modals/alert-modal";


interface SettingsFromProps {
  initialData: Store,
}

const SettingsFrom: FC<SettingsFromProps> = (props) => {
  const { initialData } = props;
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  })

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    startTransition(async () => {
      try {
        await axios.patch(`/api/stores/${params.storeId}`, values);
        router.refresh();
        toast.success("Store updated");
      } catch (error) {
        toast.error("Something went wrong.");
      }
    })
  }

  const onDelete = () => {
    startTransition(async () => {
      try {
        axios.delete(`/api/stores/${params.storeId}`);
        router.push('/');
        router.refresh();
        toast.success("Store deleted.");
      } catch (err) {
        toast.error("Make sure you removed all products and categories first.");
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
          title="Settings"
          description="Manage store performance"
        />
        <Button
          disabled={isPending}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash/>
        </Button>
      </div>
      <Separator/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
                      placeholder="Store name" 
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
            className="ml-auto"
          >
            Save
          </Button>
        </form>
      </Form>
      <Separator/>
      <ApiAlert
        title="Title text"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />      
    </>
  )
}

export { SettingsFrom }