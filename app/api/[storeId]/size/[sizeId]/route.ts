import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET (req: Request, {params}: {params: {sizeId: string}}){
  if (!params.sizeId) return new Response("Size id is required", { status: 400 });

  try {
    const size = await prisma.size.findUnique({ where: { id: params.sizeId } });
    return NextResponse.json(size);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}

export async function PATCH(req: Request, {params}: {params: {storeId: string, sizeId: string}}) {
  const {userId} = auth();
  const body = await req.json();
  const { name, value } = body;

  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  if (!name) return new NextResponse("Name is required", { status: 400 });
  if (!value) return new NextResponse("Value is required", { status: 400 });
  if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });
  if (!params.sizeId) return new NextResponse("Sizee id is required", { status: 400 });

  try {
    const sizeExisting = await prisma.size.findUnique({ where: { id: params.sizeId } });
    if  (!sizeExisting) return new NextResponse("Size does not existing", { status: 403 });

    const size = await prisma.size.updateMany({
      where: { id: params.sizeId },
      data: { name, value }
    })

    return NextResponse.json(size);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
} 

export async function DELETE (req: Request, { params }: { params: {storeId: string, sizeId: string} }) {
  const {userId} = auth();

  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });
  if (!params.sizeId) return new NextResponse("Size id is required", { status: 400 });

  try {
    const sizeExisting = await prisma.size.findUnique({ where: { id: params.sizeId } });
    if  (!sizeExisting) return new NextResponse("Size does not existing", { status: 403 });
    
    const size = await prisma.size.deleteMany({ where: { id: params.sizeId } })
 
    return Response.json(size);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}