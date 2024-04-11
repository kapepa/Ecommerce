import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageId(url: string) {
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  const publicFull = parts[uploadIndex + 2];
  const endIndex = publicFull.indexOf('.');
  const publicId = publicFull.substring(0, endIndex);

  return publicId;
}

export const formatter = new Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' })
