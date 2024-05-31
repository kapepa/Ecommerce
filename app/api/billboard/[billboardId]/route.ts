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

export async function PATCH (req: Request, { params }: { params: { billboardId: string } }) {
  const {userId} = auth();
  const body = await req.json();
  const { label, imageUrl } = body;
 
  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  if (!label) return new NextResponse("Label is required", { status: 400 });
  if (!imageUrl) return new NextResponse("Image Url is required", { status: 400 });
  if (!params.billboardId) return new NextResponse("Billboard id is required", { status: 400 });

  try {
    const billboardByStoreId = await prisma.billboard.findFirst({ where: { id: params.billboardId } });
    if (!billboardByStoreId) return new NextResponse("Billboard is not existing", { status: 403 });

    const billboard = await prisma.billboard.updateMany({ where: { id: params.billboardId }, data: { label, imageUrl } })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}

export async function DELETE (req: Request, { params }: { params: { billboardId: string } }) {
  const {userId} = auth();

  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  if (!params.billboardId) return new NextResponse("Billboard id is required", { status: 400 });

  try {
    const billboardByStoreId = await prisma.billboard.findFirst({ where: { id: params.billboardId } });
    if (!billboardByStoreId) return new NextResponse("Billboard is not existing", { status: 403 });
    if(!!billboardByStoreId.imageUrl) await cloudinaryDelete(billboardByStoreId.imageUrl);
    
    const billboard = await prisma.billboard.deleteMany({ where: { id: params.billboardId } })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}