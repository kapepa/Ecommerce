import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST (req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { phoneOne, ruText, uaText } = body;
  
    if (!userId) return NextResponse.json("Неавторизованный.", { status: 401 });
    if (!phoneOne) return NextResponse.json("Неверный формат телефона.", { status: 401 });
    if (!ruText) return NextResponse.json("Добавить текст о нас на Русском.", { status: 401 });
    if (!uaText) return NextResponse.json("Добавить текст о нас на Украинском.", { status: 401 });

    await prisma.aboutUs.create({
      data: body,
    })

    return NextResponse.json("Успешно создан раздел о нас.", { status: 201 })
  } catch {
    return NextResponse.json("Ошибка при создании.", { status: 404 })
  }
}