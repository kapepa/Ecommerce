import { cloudinaryDelete } from "@/lib/cloudinary";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from 'next/cache'

export async function DELETE (req: NextRequest, { params }: { params: { name: string } }) {
  try {
    const imageName = params.name;

    const existingImage = await prisma.image.findFirst({
      where: {
        url: {
          endsWith: `/${imageName}`
        }
      },
    })

    // if (!existingBillboard) return NextResponse.json("Image not found", { status: 400 })

    const getNameId = imageName.split(".").shift();
    if (!!getNameId){
      await cloudinaryDelete(getNameId, true);
      
      if(!!existingImage) {
        await prisma.image.delete({
          where: {
            id: existingImage.id,
          },
        })
      }
    }

    revalidateTag(`product`)

    return new NextResponse("Изображение успешно удалено.", { status: 200 })
  } catch (err) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}