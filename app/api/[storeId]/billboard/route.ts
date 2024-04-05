
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST (req: Request, { params }: { params: { storeId: string } }) {
  const {userId} = auth();
  const body = await req.json();
  const { label, imageUrl } = body;
 
  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  if (!label) return new NextResponse("Label is required", { status: 400 });
  if (!imageUrl) return new NextResponse("ImageUrl is required", { status: 400 });
  if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

  try {
    const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } })

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const billboard = await prisma.billboard.create({ data: { label, imageUrl, storeId: params.storeId } })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}

export async function GET (req: Request, { params }: { params: { storeId: string } }) {
  if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

  try {
    const billboard = await prisma.billboard.findMany({ where: { storeId: params.storeId } })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}