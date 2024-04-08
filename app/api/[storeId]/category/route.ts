import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST (req: Request, { params }: { params: { storeId: string } }) {
  const {userId} = auth();
  const body = await req.json();
  const { name, billboardId } = body;
 
  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  if (!name) return new NextResponse("Name is required", { status: 400 });
  if (!billboardId) return new NextResponse("BillboardId is required", { status: 400 });
  if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

  try {
    const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } })
    const billboard = await prisma.billboard.findFirst({ where: { label: billboardId } })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });
    if (!billboard) return new NextResponse("BillboardId isn't fond", { status: 403 });

    const category = await prisma.category.create({data: { name, billboardId: billboard.id, storeId: storeByUserId.id }, include: { store: true, billboard: true }});
    return NextResponse.json(category);
  } catch (error) {
    console.log(error)
    return new NextResponse("Interal error", { status: 500 })
  }
}

export async function GET (req: Request, { params }: { params: { storeId: string } }) {
  if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

  try {
    const category = await prisma.category.findMany({ where: { storeId: params.storeId } })
 
    return Response.json(category);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}