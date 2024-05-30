"use client"
 
import { z } from "zod"
 
const storeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters.", }).max(50),
});

const settingsSchema = z.object({
  name: z.string().min(1, { message: "Name must be at least 1 characters." }).max(50),
})

const billboardSchema = z.object({
  label: z.string().min(1, { message: "Name must be at least 1 characters." }).max(50),
  imageUrl: z.string().min(1),
})

const categorySchema = z.object({
  name: z.string().min(1, { message: "Name must be at least 1 characters." }).max(50),
  billboardLabel: z.string().min(1),
})

const sizeSchema = z.object({
  name: z.string().min(1, { message: "Name must be at least 1 characters." }).max(50),
  value: z.string().min(1, { message: "Size must be at least 1 characters." }).max(50),
})

const colorSchema = z.object({
  name: z.string().min(1, { message: "Name must be at least 1 characters." }).max(50),
  url: z.string({ required_error: "Color is required, you need to upload an image" }),
  // value: z.string().min(3, { message: "Color must be at least 1 characters." })
  // value: z.string().min(4, { message: "Size must be at least 1 characters." }).regex(/^#/, { message: "String must be a valid hex code" }),
})

const productSchema = z.object({
  name: z.string().min(1, { message: "Name must be at least 1 characters." }).max(50),
  price: z.coerce.number().min(1),
  meta: z.string(),
  description: z.string(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  categoryId: z.string().min(1, { message: "Category required" }),
  sizeId: z.string().min(1, { message: "Size required" }),
  colorId: z.string().min(1, { message: "Color required" }),
  image: z.array(z.object({ url: z.string() })).min(1, { message: "Images required" })
  // image: z.object({ url: z.string() }).array()
})

export { storeSchema, settingsSchema, billboardSchema, categorySchema, sizeSchema, colorSchema, productSchema };