"use server"

import { cloudinaryDeleteManyByUrl } from "@/lib/cloudinary";
import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST( req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json() as string[];
    const categories = await prisma.category.findMany({
      where: {
        url: { in: body }
      }
    })

    if (!!categories.length) {
      const filter = categories
      .filter(category => !body.includes(category.url))
      .map(category => category.url);

      if(!!filter.length) await cloudinaryDeleteManyByUrl(filter);
    } else {
      await cloudinaryDeleteManyByUrl(body);
    }

    revalidateTag(`color`)

    return new NextResponse("Изображения категорий были успешно удалены.", { status: 200 })
  } catch (err) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}