import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST (req: Request) {
  const { userId } : { userId: string | null } = auth();
  const body = await req.json();
  const { name, value } = body;

  if (!userId) return new NextResponse("Неаутентифицированный", { status: 401 });
  if (!name) return new NextResponse("Имя обязательно", { status: 400 });
  if (!value) return new NextResponse("Требуется значение", { status: 400 });

  try {
    const size = await prisma.size.create({ data: { name, value } });
    return NextResponse.json(size)
  } catch (error) {
    return new NextResponse("Интервальная ошибка", { status: 500 })
  }
}

export async function GET() {
  try {
    const size = await prisma.size.findMany();
    return NextResponse.json(size)
  } catch (error) {
    return new NextResponse("Интервальная ошибка", { status: 500 })
  }
}