
import { cloudinaryDelete } from '@/lib/cloudinary';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET (req: Request, { params }: { params: { categoryId: string } }) {
  if (!params.categoryId) return new NextResponse("Идентификатор категории обязателен", { status: 400 });
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale");

  const isRu = locale === "ru";
  const isUa = locale === "ua";

  try {
    const category = await prisma.category.findUnique({ 
      where: { 
        id: params.categoryId
      },
      select: {
        id: true,
        url: true,
        ruName: isRu,
        uaName: isUa,
      }
    })
 
    return Response.json(category);
  } catch (error) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}

export async function PATCH (req: Request, { params }: { params: { categoryId: string } }) {
  const { userId } = auth();
  const body = await req.json();
  const { url, ruName, uaName } = body;
 
  if (!userId) return new NextResponse("Неаутентифицированный", { status: 401 });
  if (!url) return new NextResponse("Изображение обязательно", { status: 400 });
  if (!ruName) return new NextResponse("Имя обязательно", { status: 400 });
  if (!uaName) return new NextResponse("Имя обязательно", { status: 400 });
  if (!params.categoryId) return new NextResponse("Идентификатор категории обязателен", { status: 400 });

  try {
    const categoryByStoreId = await prisma.category.findFirst({ where: { id: params.categoryId } });
    if (!categoryByStoreId) return new NextResponse("Категория не существует", { status: 403 });

    const billboard = await prisma.category.updateMany({ where: { id: params.categoryId }, data: body });
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}

export async function DELETE (req: Request, { params }: { params: { categoryId: string } }) {
  const {userId} = auth();

  if (!userId) return new NextResponse("Неаутентифицированный", { status: 401 });
  if (!params.categoryId) return new NextResponse("Идентификатор категории обязателен", { status: 400 });

  try {
    const existingCategory = await prisma.category.findFirst({ where: { id: params.categoryId } });
    if (!existingCategory) return new NextResponse("Категория не существует", { status: 403 });

    if(!!existingCategory.url) await cloudinaryDelete(existingCategory.url, true);
    const category = await prisma.category.delete({ where: { id: params.categoryId } })
 
    return Response.json(category);
  } catch (error) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}