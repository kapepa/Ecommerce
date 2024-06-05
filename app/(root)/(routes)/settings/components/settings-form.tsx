"use client"

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
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
import { AlertModal } from "@/components/modals/alert-modal";

const SettingsFrom: FC = (props) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    startTransition(async () => {
      try {
        router.refresh();
        toast.success("");
      } catch (error) {
        toast.error(".");
      }
    })
  };

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        loading={isPending}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      /> */}
      <div className="flex items-center justify-between">
        <Heading
          title="Настройки"
          description="Управление работой магазина"
        />
      </div>
      <Separator/>
      {/* <Form {...form}>
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
      </Form> */}
      <Separator/>    
    </>
  )
}

export { SettingsFrom }