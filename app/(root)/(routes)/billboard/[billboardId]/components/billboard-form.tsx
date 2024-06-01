"use client"

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { billboardSchema } from "@/schema";
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

const garbageImges = (initialUrl: string | undefined) => {
  const start = !!initialUrl ? [initialUrl] : [];

  const [imageUrl, setImageUrl] = useState<string[]>(start);
  const [loadedUrl, setLoadedUrl] = useState<string[]>([]);

  return {
    loadedUrl: (url: string | undefined) => {
      if (!url) return;
      loadedUrl.push(url)
      setLoadedUrl(loadedUrl);
    },
    getDelete: async (urls: string[]) => {
      const delImgList = loadedUrl.filter(url => !urls.includes(url));
      if (!!delImgList) {
        await axios({
          method: "post",
          url: "/api/image/delete",
          data: delImgList
        })
      }
    },
    setImgUrl: (url: string[]) => {
      setImageUrl(url);
    },
    clearImgUrl: () => {
      setImageUrl([]);
      setLoadedUrl([]);
    },
    closeComp: async () => {
      const delImgList = loadedUrl.filter(url => !imageUrl.includes(url));
      if (!!delImgList) {
        await axios({
          method: "post",
          url: "/api/image/delete",
          data: delImgList
        })
      }
    }
  }
}

const BillboardForm: FC<BillboardFormProps> = (prosp) => {
  const { initialData } = prosp;
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const { setImgUrl, loadedUrl, getDelete, clearImgUrl, closeComp } = garbageImges(initialData?.imageUrl)

  const title = !!initialData ? "Edit billboard." : "Create billboard.";
  const description = !!initialData ? "Edit a billboard." : "Add a new billboard.";
  const soastSuccessMessage = !!initialData ? "Billboard updated." : "Billboard created";
  const btnLabel = !!initialData ? "Save changes" : "Create";

  const form = useForm<z.infer<typeof billboardSchema>>({
    resolver: zodResolver(billboardSchema),
    defaultValues: 
      initialData ?? 
      {
        label: "",
        imageUrl: "",
      },
  });

  useLayoutEffect(() => {
    closeComp();
  }, [closeComp])

  function onSubmit(values: z.infer<typeof billboardSchema>) {
    startTransition(async () => {
      try {
        if(!!initialData) {
          await axios.patch(`/api/billboard/${params.billboardId}`, values);
        } else {
          await axios.post(`/api/billboard`, values);
        }
        await getDelete([values.imageUrl])
        toast.success(soastSuccessMessage);
        router.push(`/billboard`);
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
        await axios.delete(`/api/billboard/${params.billboardId}`);
        router.push(`/billboard`);
        toast.success("Billboard deleted.");
      } catch (err) {
        toast.error("Make sure you removed all categories using this billboard first.");
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      disabled={isPending}
                      value={ !!field.value ? [field.value] : []}
                      onChange={(url) => {
                        loadedUrl(url);
                        field.onChange(url);
                      }}
                      onRemove={() => {
                        field.onChange("")
                        clearImgUrl()
                      }}
                      urlPath="billboard"
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
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={isPending}
                      placeholder="Bullboard label" 
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