import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST (req: Request) {
  const {userId} = auth();
  const body = await req.json();
  const { ruName, uaName, url } = body;

  if (!userId) return new NextResponse("Неаутентифицированный", { status: 401 });
  if (!url) return new NextResponse("Изображение обязательно", { status: 400 });
  if (!ruName) return new NextResponse("Имя обязательно RU", { status: 400 });
  if (!uaName) return new NextResponse("Имя обязательно UA", { status: 400 });

  try {
    const category = await prisma.category.create({data: body});
    return NextResponse.json(category);
  } catch (error) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}

export async function GET (req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale")

    const isRu = locale === "ru";
    const isUA = locale === "ua";

    const category = await prisma.category.findMany({
      select: {
        id: true,
        ruName: isRu,
        uaName: isUA,
      }
    })
 
    return Response.json(category);
  } catch (error) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}