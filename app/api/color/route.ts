import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = auth();
  const body = await req.json();
  const { ruName, uaName, url } = body; 

  if (!userId) return NextResponse.json("Неаутентифицированный", { status: 400 });
  if (!ruName) return NextResponse.json("Имя обязательно RU", { status: 400 });
  if (!uaName) return NextResponse.json("Имя обязательно UA", { status: 400 });
  if (!url) return NextResponse.json("Требуется значение", { status: 400 });

  try {
    const color = await prisma.color.create({ data: body });

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