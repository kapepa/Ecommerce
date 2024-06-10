import { cloudinaryDeleteManyByUrl, cloudinaryfetchAllImages } from "@/lib/cloudinary";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE () {
  try {
    const gatherImages: string[] = [];
    const allImagesCloudinary = await cloudinaryfetchAllImages();

    const fetchBillboard = await prisma.billboard.findMany({
      select: {
        imageUrl: true,
      }
    })
    if (!!fetchBillboard.length) fetchBillboard.forEach(billboard => gatherImages.push(billboard.imageUrl));

    const fetchColor = await prisma.color.findMany({
      select: {
        url: true,
      }
    })
    if (!!fetchColor.length) fetchColor.forEach(color => gatherImages.push(color.url));
    
    const fetchCategories = await prisma.category.findMany({
      select: {
        url: true,
      }
    })
    if (!!fetchCategories.length) fetchCategories.forEach(image => gatherImages.push(image.url));

    const fetchImages = await prisma.image.findMany({
      select: {
        url: true,
      }
    })
    if (!!fetchImages.length) fetchImages.forEach(image => gatherImages.push(image.url));

    const unsedImages = allImagesCloudinary.filter(url => {
      return !gatherImages.some(img => {
        const endPart = img.split("://").pop();
        return url.endsWith(endPart || "")
      })
    })

    await cloudinaryDeleteManyByUrl(unsedImages);

    return NextResponse.json("Очистка неиспользуемых изображений прошла успешно.", { status: 200 })
  } catch {
    return NextResponse.json("Что-то пошло не так при удалении мусора.", { status: 400 })
  }
}