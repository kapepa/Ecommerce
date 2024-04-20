
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { cloudinaryDelete } from '@/lib/cloudinary';

export async function GET (req: Request, { params }: { params: { billboardId: string } }) {
  if (!params.billboardId) return new NextResponse("Billboard id is required", { status: 400 });

  try {
    const billboard = await prisma.billboard.findUnique({ where: { id: params.billboardId } })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}

export async function PATCH (req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
  const {userId} = auth();
  const body = await req.json();
  const { label, imageUrl } = body;
 
  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  if (!label) return new NextResponse("Label is required", { status: 400 });
  if (!imageUrl) return new NextResponse("Image Url is required", { status: 400 });
  if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });
  if (!params.billboardId) return new NextResponse("Billboard id is required", { status: 400 });

  try {
    const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const billboardByStoreId = await prisma.billboard.findFirst({ where: { id: params.billboardId, storeId: params.storeId } });
    if (!billboardByStoreId) return new NextResponse("Billboard is not existing", { status: 403 });

    const billboard = await prisma.billboard.updateMany({ where: { id: params.billboardId,  storeId: params.storeId }, data: { label, imageUrl } })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}

export async function DELETE (req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
  const {userId} = auth();

  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });
  if (!params.billboardId) return new NextResponse("Billboard id is required", { status: 400 });

  try {
    const storeByUserId = await prisma.store.findFirst({ where: { id: params.storeId, userId } })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const billboardByStoreId = await prisma.billboard.findFirst({ where: { id: params.billboardId, storeId: params.storeId } });
    if (!billboardByStoreId) return new NextResponse("Billboard is not existing", { status: 403 });
    if(!!billboardByStoreId.imageUrl) await cloudinaryDelete(billboardByStoreId.imageUrl);
    
    const billboard = await prisma.billboard.deleteMany({ where: { id: params.billboardId,  storeId: params.storeId } })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}