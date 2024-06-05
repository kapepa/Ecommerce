import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST (req: Request) {
  const {userId} = auth();
  const body = await req.json();
  const { name, billboardLabel } = body;
 
  if (!userId) return new NextResponse("Неаутентифицированный", { status: 401 });
  if (!name) return new NextResponse("Имя обязательно", { status: 400 });
  if (!billboardLabel) return new NextResponse("Требуется идентификатор рекламного щита", { status: 400 });

  try {
    const category = await prisma.category.create({data: { name, billboardLabel }, include: { billboard: true }});
    return NextResponse.json(category);
  } catch (error) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}

export async function GET (req: Request) {
  try {
    const category = await prisma.category.findMany()
 
    return Response.json(category);
  } catch (error) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}