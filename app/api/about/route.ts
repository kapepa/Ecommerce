import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest) {
  try {
    const locale = req.nextUrl.searchParams.get("locale");
    
    const about = await prisma.aboutUs.findFirst({
      select: {
        phoneOne: true,
        phoneTwo: true,
        ruText: locale === "ru",
        uaText: locale === "ua",
      }
    });
    if (!about) return NextResponse.json("Запрещенный", { status: 403 });

    return NextResponse.json(about, { status: 200 });
  } catch {
    return NextResponse.json("Запрещено о нас GET")
  }
}

export async function POST (req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { phoneOne, ruText, uaText } = body;
  
    if (!userId) return NextResponse.json("Неавторизованный.", { status: 401 });
    if (!phoneOne) return NextResponse.json("Неверный формат телефона.", { status: 401 });
    if (!ruText) return NextResponse.json("Добавить текст о нас на Русском.", { status: 401 });
    if (!uaText) return NextResponse.json("Добавить текст о нас на Украинском.", { status: 401 });

    const existingAbout = await prisma.aboutUs.findFirst();
    if (!!existingAbout) await prisma.aboutUs.delete({
      where: {
        id: existingAbout.id
      }
    })

    await prisma.aboutUs.create({
      data: body,
    })

    return NextResponse.json("Успешно создан раздел о нас.", { status: 201 })
  } catch {
    return NextResponse.json("Ошибка при создании.", { status: 404 })
  }
}

export async function PATCH (req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return NextResponse.json("Неавторизованный.", { status: 401 });

    const existingAbout = await prisma.aboutUs.findFirst();
    if (!existingAbout) return NextResponse.json("Запрещенный", { status: 403 });

    await prisma.aboutUs.update({
      where: {
        id: existingAbout.id
      },
      data: body
    })

    return NextResponse.json("О Нас было успешно обновлено.", { status: 200 })
  } catch {
    return NextResponse.json("Ошибка при обновлении.", { status: 404 })
  }
}