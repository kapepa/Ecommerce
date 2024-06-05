import { cloudinaryDelete } from "@/lib/cloudinary";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from 'next/cache'

export async function DELETE (req: NextRequest, { params }: { params: { name: string } }) {
  try {
    const imageName = params.name;

    const existingBillboard = await prisma.billboard.findFirst({
      where: {
        imageUrl: {
          endsWith: `/${imageName}`
        }
      }
    })

    // if (!existingBillboard) return NextResponse.json("Image not found", { status: 400 })

    const getNameId = imageName.split(".").shift();
    if (!!getNameId){
      await cloudinaryDelete(getNameId, true);
      
      if(!!existingBillboard) {
        await prisma.billboard.update({
          where: {
            id: existingBillboard.id,
          },
          data: {
            imageUrl: "",
          }
        })
      }
    }

    revalidateTag(`billboard`)

    return new NextResponse("Изображение успешно удалено.", { status: 200 })
  } catch (err) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}