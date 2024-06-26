import { cloudinaryDelete } from "@/lib/cloudinary";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (req: Request, { params }: { params: { colorId: string } }) {
  if (!params.colorId) return NextResponse.json("Требуется идентификатор размера", { status: 400 });

  try {
    const color = await prisma.color.findUnique({ where: { id: params.colorId } });
    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    return NextResponse.json("Внутренняя ошибка", { status: 500 })
  }
}

export async function PATCH (req: Request, { params }: { params: { colorId: string } }) {
  const { userId } = auth();
  const body = await req.json();
  const { url, ruName, uaName } = body; 

  if (!userId) return NextResponse.json("Неаутентифицированный", { status: 400 });
  if (!ruName) return NextResponse.json("Имя обязательно", { status: 400 });
  if (!uaName) return NextResponse.json("Имя обязательно", { status: 400 });
  if (!url) return NextResponse.json("Требуется значение", { status: 400 });

  try {
    const colorExisting = await prisma.color.findUnique({ where: { id: params.colorId } });
    if (!colorExisting) return NextResponse.json("Цвет не существует", { status: 403 });

    const color = await prisma.color.update({ where: { id: params.colorId }, data: body });

    return NextResponse.json(color);
  } catch (error) {
    return NextResponse.json("Внутренняя ошибка", { status: 500 });
  }
}

export async function DELETE (req: Request, { params }: { params: { colorId: string } }) {
  try {
    const colorExisting = await prisma.color.findUnique({ where: { id: params.colorId } });
    if (!colorExisting) return NextResponse.json("Цвет не существует", { status: 403 });

    if (!!colorExisting.url) await cloudinaryDelete(colorExisting.url, true);
    const color = await prisma.color.delete({ where: { id: params.colorId } });
    return NextResponse.json(color)
  } catch (error) {
    return NextResponse.json("Внутренняя ошибка", { status: 500 });
  }
}