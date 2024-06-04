"use server"

import { cloudinaryDeleteManyByUrl } from "@/lib/cloudinary";
import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST( req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json() as string[];
    const existingBillboard = await prisma.image.findMany({
      where: {
        url: { in: body }
      }
    })

    if (!!existingBillboard.length) {
      const filter = existingBillboard
      .filter(image => !body.includes(image.url))
      .map(image => image.url);

      if(!!filter.length) await cloudinaryDeleteManyByUrl(filter);
    } else {
      await cloudinaryDeleteManyByUrl(body);
    }

    revalidateTag(`product`)

    return new NextResponse("Изображения были успешно удалены.", { status: 200 })
  } catch (err) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}