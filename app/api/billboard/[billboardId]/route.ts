import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { cloudinaryDelete } from '@/lib/cloudinary';

export async function GET (req: Request, { params }: { params: { billboardId: string } }) {
  if (!params.billboardId) return new NextResponse("Требуется идентификатор рекламного щита", { status: 400 });

  try {
    const billboard = await prisma.billboard.findUnique({ where: { id: params.billboardId } })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}

export async function PATCH (req: Request, { params }: { params: { billboardId: string } }) {
  const {userId} = auth();
  const body = await req.json();
  const { label, imageUrl, active } = body;
 
  if (!userId) return new NextResponse("Неаутентифицированный", { status: 401 });
  if (!label) return new NextResponse("Этикетка обязательна", { status: 400 });
  if (!imageUrl) return new NextResponse("Изображения обязателен", { status: 400 });
  if (!params.billboardId) return new NextResponse("Требуется идентификатор рекламного щита", { status: 400 });

  try {
    const billboardById = await prisma.billboard.findFirst({ where: { id: params.billboardId } });
    if (!billboardById) return new NextResponse("Билборд не существует", { status: 403 });

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

    const billboard = await prisma.billboard.updateMany({ where: { id: params.billboardId }, data: { label, imageUrl, active } })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}

export async function DELETE (req: Request, { params }: { params: { billboardId: string } }) {
  const {userId} = auth();

  if (!userId) return new NextResponse("Неаутентифицированный", { status: 401 });
  if (!params.billboardId) return new NextResponse("Требуется идентификатор рекламного щита", { status: 400 });

  try {
    const billboardByStoreId = await prisma.billboard.findFirst({ where: { id: params.billboardId } });
    if (!billboardByStoreId) return new NextResponse("Билборд не существует", { status: 403 });
    if(!!billboardByStoreId.imageUrl) await cloudinaryDelete(billboardByStoreId.imageUrl);
    
    const billboard = await prisma.billboard.deleteMany({ where: { id: params.billboardId } })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Внутренняя ошибка", { status: 500 })
  }
}