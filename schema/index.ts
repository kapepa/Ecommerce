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

export { storeSchema, settingsSchema, billboardSchema, categorySchema, sizeSchema };