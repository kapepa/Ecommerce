"use server"

import { cloudinaryManyDeleteByUrl } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST( req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    await cloudinaryManyDeleteByUrl(body);

    return new NextResponse("Imges were success deleted.", { status: 200 })
  } catch (err) {
    return new NextResponse("Interal error", { status: 500 })
  }
}