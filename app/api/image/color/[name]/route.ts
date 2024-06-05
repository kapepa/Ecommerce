import { cloudinaryDelete } from "@/lib/cloudinary";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from 'next/cache'

export async function DELETE (req: NextRequest, { params }: { params: { name: string } }) {
  try {
    const colorUrl = params.name;

    const existingColor = await prisma.color.findFirst({
      where: {
        url: {
          endsWith: `/${colorUrl}`
        }
      }
    })

    // if (!existingColor) return NextResponse.json("Цвет не найден", { status: 400 })

    const getNameId = colorUrl.split(".").shift();
    if (!!getNameId){
      await cloudinaryDelete(getNameId, true);

      if (!!existingColor) {
        await prisma.color.update({
          where: {
            id: existingColor.id,
          },
          data: {
            url: "",
          }
        })
      }
    }

    revalidateTag(`color`)

    return new NextResponse("Цвет был успешно удален.", { status: 200 })
  } catch (err) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}