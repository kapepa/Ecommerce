import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = auth();
  const body = await req.json();
  const { name, url } = body; 

  if (!userId) return NextResponse.json("Неаутентифицированный", { status: 400 });
  if (!name) return NextResponse.json("Имя обязательно", { status: 400 });
  if (!url) return NextResponse.json("Требуется значение", { status: 400 });

  try {
    const color = await prisma.color.create({ data: { name, url } });

    return Response.json(color, { status: 201 });
  } catch (err) {
    return NextResponse.json("Внутренняя ошибка", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const color = await prisma.color.findMany();
    return NextResponse.json(color)
  } catch (error) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}