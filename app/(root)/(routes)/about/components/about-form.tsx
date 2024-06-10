"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { aboutUsSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AboutUs } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { FC, useTransition } from "react";
import PhoneInput from 'react-phone-number-input/react-hook-form-input'
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface SizeFormProps {
  initialData: AboutUs | null
}

const AboutForm: FC<SizeFormProps> = (props) => {
  const { initialData } = props;
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const title = !!initialData ? "Изменить о нас." : "Создать о нас.";
  const description = !!initialData ? "Редактирование о нас" : "Написать о нас";
  const toastSuccessMessage = !!initialData ? "О нас изменено." : "О нас создано";
  const btnLabel = !!initialData ? "Сохранить изменения" : "Создать";

  const form = useForm<z.infer<typeof aboutUsSchema>>({
    resolver: zodResolver(aboutUsSchema),
    defaultValues: initialData || {
      phoneOne: "",
      ruText: "",
      uaText: "",
    },
  })
 
  function onSubmit(values: z.infer<typeof aboutUsSchema>) {
    startTransition(async () => {
      try {
        if(!!initialData) {
          await axios.patch(`/api/size/${params.sizeId}`, values)
        } else {
          await axios.post(`/api/size`, values)
        }
        toast.success(toastSuccessMessage);
        router.push(`/size`);
      } catch (error) {
        toast.error("Что-то пошло не так.");
      } finally {
        router.refresh()
      }
    })
  }


  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={title}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="phoneOne"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер телефона</FormLabel>
                  <FormControl>
                    <PhoneInput
                      country="UA"
                      international
                      withCountryCallingCode
                      control={form.control}
                      rules={{ required: true }} 
                      inputComponent={ Input }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneTwo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер телефона</FormLabel>
                  <FormControl>
                    <PhoneInput
                      country="UA"
                      international
                      withCountryCallingCode
                      control={form.control}
                      rules={{ required: true }} 
                      inputComponent={ Input }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" grid grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="ruText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`${description} на RU`}</FormLabel>
                  <FormControl>
                  <Textarea
                    disabled={isPending}
                    placeholder={`${description} RU`}
                    {...field}
                  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" grid grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="uaText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`${description} на UA`}</FormLabel>
                  <FormControl>
                  <Textarea
                    disabled={isPending}
                    placeholder={`${description} UA`}
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

export { AboutForm }