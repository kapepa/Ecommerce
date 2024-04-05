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

export { storeSchema, settingsSchema, billboardSchema };