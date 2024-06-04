import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET (req: Request, {params}: {params: {sizeId: string}}){
  if (!params.sizeId) return new Response("Требуется идентификатор размера", { status: 400 });

  try {
    const size = await prisma.size.findUnique({ where: { id: params.sizeId } });
    return NextResponse.json(size);
  } catch (error) {
    return new NextResponse("Интервальная ошибка", { status: 500 })
  }
}

export async function PATCH(req: Request, {params}: {params: { sizeId: string }}) {
  const {userId} = auth();
  const body = await req.json();
  const { name, value } = body;

  if (!userId) return new NextResponse("Неаутентифицированный", { status: 401 });
  if (!name) return new NextResponse("Имя обязательно", { status: 400 });
  if (!value) return new NextResponse("Требуется значение", { status: 400 });
  if (!params.sizeId) return new NextResponse("Требуется идентификатор размера", { status: 400 });

  try {
    const sizeExisting = await prisma.size.findUnique({ where: { id: params.sizeId } });
    if  (!sizeExisting) return new NextResponse("Размер не существует", { status: 403 });

    const size = await prisma.size.updateMany({
      where: { id: params.sizeId },
      data: { name, value }
    })

    return NextResponse.json(size);
  } catch (error) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
} 

export async function DELETE (req: Request, { params }: { params: { sizeId: string } }) {
  const {userId} = auth();

  if (!userId) return new NextResponse("Неаутентифицированный", { status: 401 });
  if (!params.sizeId) return new NextResponse("Требуется идентификатор размера", { status: 400 });

  try {
    const sizeExisting = await prisma.size.findUnique({ where: { id: params.sizeId } });
    if  (!sizeExisting) return new NextResponse("Размер не существует", { status: 403 });
    
    const size = await prisma.size.deleteMany({ where: { id: params.sizeId } })
 
    return Response.json(size);
  } catch (error) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}