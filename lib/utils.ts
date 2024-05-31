import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageId(url: string) {
  const split = url.split('/');
  const imageName = split.pop();

  return imageName;
}

export const formatter = new Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' })
