"use server"

import { cloudinaryDeleteManyByUrl } from "@/lib/cloudinary";
import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST( req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json() as string[];
    const existingBillboard = await prisma.billboard.findMany({
      where: {
        imageUrl: { in: body }
      }
    })

    if (!!existingBillboard.length) {
      const filter = existingBillboard
      .filter(billboard => !body.includes(billboard.imageUrl))
      .map(billboard => billboard.imageUrl);

      if(!!filter.length) await cloudinaryDeleteManyByUrl(filter);
    } else {
      const result = await cloudinaryDeleteManyByUrl(body);
      console.log(result)
    }

    revalidateTag(`billboard`)

    return new NextResponse("Imges were success deleted.", { status: 200 })
  } catch (err) {
    return new NextResponse("Interal error", { status: 500 })
  }
}