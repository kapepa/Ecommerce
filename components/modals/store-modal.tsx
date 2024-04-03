"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../ui/modal";
import { useForm } from "react-hook-form"
import { z } from "zod";
import { storeSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTransition } from "react";
import toast from 'react-hot-toast';
import axios from 'axios';

const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof storeSchema>>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof storeSchema>) => {
    startTransition(async () => {
      try {
        const response = await axios.post("/api/stores", values);
        // toast.success("Store created.")
        window.location.assign(`/${response.data.id}`)
      } catch (err) {
        toast.error("Something went wrong.");
      }
    })
  }

  return (
    <Modal
      title="Create store"
      desription="Add new store"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={isPending}
                      placeholder="Name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isPending}
                >Cancel</Button>
              <Button 
                type="submit"
                disabled={isPending}
                >Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  )
}

export { StoreModal }