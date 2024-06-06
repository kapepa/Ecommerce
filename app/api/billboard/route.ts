import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST (req: Request) {
  const {userId} = auth();
  const body = await req.json();
  const { label, imageUrl, active } = body;
 
  if (!userId) return new NextResponse("Неаутентифицированный", { status: 401 });
  if (!label) return new NextResponse("Этикетка обязательна", { status: 400 });
  if (!imageUrl) return new NextResponse("Изображения обязателен", { status: 400 });

  try {
    if (active) {
      const getActiveBillboard = await prisma.billboard.findMany({ where: { active: true } });
      if (!!getActiveBillboard) {
        await prisma.billboard.updateMany({
          where: {
            active: true,
          },
          data: {
            active: false,
          }
        })
      }
    }

    const billboard = await prisma.billboard.create({ data: { label, imageUrl, active } })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Интервальная ошибка", { status: 500 })
  }
}

export async function GET (req: Request) {
  try {
    const billboard = await prisma.billboard.findFirst({
      where: {
        active: true,
      }
    })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Интервальная ошибка", { status: 500 })
  }
}