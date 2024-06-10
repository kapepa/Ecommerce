import { cloudinaryDelete } from "@/lib/cloudinary";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from 'next/cache'

export async function DELETE (req: NextRequest, { params }: { params: { name: string } }) {
  try {
    const categoryUrl = params.name;

    const existingCategory = await prisma.category.findFirst({
      where: {
        url: {
          endsWith: `/${categoryUrl}`
        }
      }
    })

    // if (!existingColor) return NextResponse.json("Цвет не найден", { status: 400 })

    const getNameId = categoryUrl.split(".").shift();
    if (!!getNameId){
      await cloudinaryDelete(getNameId, true);

      if (!!existingCategory) {
        await prisma.category.update({
          where: {
            id: existingCategory.id,
          },
          data: {
            url: "",
          }
        })
      }
    }

    revalidateTag(`categories`)

    return new NextResponse("Изображения категории были успешно удален.", { status: 200 })
  } catch (err) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}