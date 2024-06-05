"use client"
 
import { z } from "zod"
 
const storeSchema = z.object({
  name: z.string().min(2, { message: "Имя должно состоять не менее чем из 2 символов.", }).max(50),
});

const settingsSchema = z.object({
  name: z.string().min(1, { message: "Имя должно содержать не менее 1 символа." }).max(50),
})

const billboardSchema = z.object({
  label: z.string().min(1, { message: "Метка должна содержать не менее 1 символа" }).max(50),
  active: z.boolean(),
  imageUrl: z.string().min(1),
})

const categorySchema = z.object({
  name: z.string().min(1, { message: "Имя должно содержать не менее 1 символа." }).max(50),
  billboardLabel: z.string().min(1),
})

const sizeSchema = z.object({
  name: z.string().min(1, { message: "Имя должно содержать не менее 1 символа." }).max(50),
  value: z.string().min(1, { message: "Размер должен быть не менее 1 символа." }).max(50),
})

const colorSchema = z.object({
  name: z.string().min(1, { message: "Имя должно содержать не менее 1 символа." }).max(50),
  url: z.string({ required_error: "Цвет обязателен, необходимо загрузить изображение." }),
  // value: z.string().min(3, { message: "Color must be at least 1 characters." })
  // value: z.string().min(4, { message: "Size must be at least 1 characters." }).regex(/^#/, { message: "String must be a valid hex code" }),
})

const productSchema = z.object({
  name: z.string().min(1, { message: "Имя должно содержать не менее 1 символа." }).max(50),
  price: z.coerce.number().min(1),
  meta: z.string().min(1),
  description: z.string(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  categoryId: z.string().min(1, { message: "Требуемая категория" }),
  sizeId: z.string().min(1, { message: "Требуемый размер" }),
  colorId: z.string().min(1, { message: "Требуется цвет" }),
  image: z.array(z.object({ url: z.string() })).min(1, { message: "Необходимые изображения" })
  // image: z.object({ url: z.string() }).array()
})

export { storeSchema, settingsSchema, billboardSchema, categorySchema, sizeSchema, colorSchema, productSchema };