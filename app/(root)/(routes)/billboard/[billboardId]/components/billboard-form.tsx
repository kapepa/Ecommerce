"use client"

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
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
import { date, z } from "zod";

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

  const title = !!initialData ? "Edit billboard." : "Create billboard.";
  const description = !!initialData ? "Edit a billboard." : "Add a new billboard.";
  const soastSuccessMessage = !!initialData ? "Billboard updated." : "Billboard created";
  const btnLabel = !!initialData ? "Save changes" : "Create";

  useLayoutEffect(() => {
    initImagesUrls( ['asdasd'] );
  }, [initialData?.imageUrl, initImagesUrls])

  const form = useForm<z.infer<typeof billboardSchema>>({
    resolver: zodResolver(billboardSchema),
    defaultValues: 
      initialData ?? 
      {
        label: "",
        imageUrl: "",
      },
  });

  function onSubmit(values: z.infer<typeof billboardSchema>) {
      console.log(usedUrls)
    // startTransition(async () => {
    //   try {
    //     if(!!initialData) {
    //       await axios.patch(`/api/billboard/${params.billboardId}`, values);
    //     } else {
    //       await axios.post(`/api/billboard`, values);
    //     }
    //     const clearUrls = loadedUrls.concat(usedUrls).filter(url => url !== values.imageUrl);
    //     if (!!clearUrls.length) await axios.post(`/api/image/delete`,clearUrls);
    //     clearAllImg();
    //     toast.success(soastSuccessMessage);
    //     router.push(`/billboard`);
    //   } catch (err) {
    //     toast.error("Something went wrong.");
    //   } finally {
    //     setOpen(false)
    //     router.refresh();
    //   }
    // })
  };

  const clearLoadedImage = async (urls: string[]) => {
    console.log(urls)
  }

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

  const onDeleteOneImage = (url: string) => {
    const isLoaded = loadedUrls.some(url => usedUrls.includes(url));

    startTransition(async () => {
      if (isLoaded) {
        const publicId = getImageId(url);
        await axios.delete(`/api/image/billboard/${publicId}`)
        .then(() => deleteloadedUrl(url));
      }

      if (!isLoaded) {
        await axios.post(`/api/image/delete`,[url])
        .then(() => deleteloadedUrl(url));
      }

      form.setValue("imageUrl", "");
    })
  }

  // useLayoutEffect(() => {
  //   return () => {
  //     if (!!loadedUrl.length) {
  //       const delImgList = loadedUrl.filter(url => !loadedUrl.includes(url));

  //       console.log(loadedUrl)
  //       console.log(delImgList)

  //       if (!!delImgList.length) axios({
  //         method: "post",
  //         url: "/api/image/delete",
  //         data: delImgList
  //       })
  //     }
  //   }
  // }, [initialData?.imageUrl, usedUrl, loadedUrl])

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
                      onDeleteImage={onDeleteOneImage}
                      onChange={(url) => {
                        setLoadedUrl(url);
                        field.onChange(url);
                      }}
                      onRemove={() => {
                        field.onChange("")
                        clearAllImg();
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