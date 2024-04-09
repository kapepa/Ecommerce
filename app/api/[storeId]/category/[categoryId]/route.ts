
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET (req: Request, { params }: { params: { categoryId: string } }) {
  const {userId} = auth();

  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  if (!params.categoryId) return new NextResponse("Category id is required", { status: 400 });

  try {
    const category = await prisma.category.findUnique({ where: { id: params.categoryId } })
 
    return Response.json(category);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}

export async function PATCH (req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
  const { userId } = auth();
  const body = await req.json();
  const { name, billboardLabel } = body;
 
  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  if (!name) return new NextResponse("Name is required", { status: 400 });
  if (!billboardLabel) return new NextResponse("Billboard is required", { status: 400 });
  if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });
  if (!params.categoryId) return new NextResponse("Category id is required", { status: 400 });

  try {
    const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const categoryByStoreId = await prisma.category.findFirst({ where: { id: params.categoryId, storeId: params.storeId } });
    if (!categoryByStoreId) return new NextResponse("Category is not existing", { status: 403 });

    const billboard = await prisma.category.updateMany({ where: { id: params.categoryId,  storeId: params.storeId }, data: { name, billboardLabel } })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}

export async function DELETE (req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
  const {userId} = auth();

  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });
  if (!params.categoryId) return new NextResponse("Category id is required", { status: 400 });

  try {
    const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const categoryByStoreId = await prisma.category.findFirst({ where: { id: params.categoryId, storeId: params.storeId } });
    if (!categoryByStoreId) return new NextResponse("Category is not existing", { status: 403 });
    
    const category = await prisma.category.deleteMany({ where: { id: params.categoryId,  storeId: params.storeId } })
 
    return Response.json(category);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}