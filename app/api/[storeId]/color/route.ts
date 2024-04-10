import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  const { userId } = auth();
  const body = await req.json();
  const { name, value } = body; 

  if (!userId) return NextResponse.json("Unauthenticated", { status: 40 });
  if (!name) return NextResponse.json("Name is required", { status: 400 });
  if (!value) return NextResponse.json("Value is required", { status: 400 });
  if (!params.storeId) return NextResponse.json("Store id is required", { status: 400 });

  try {
    const storeExisting = await prisma.store.findUnique({ where: { id: params.storeId } });
    if(!storeExisting) return NextResponse.json("Store does not existing", { status: 403 });

    const color = await prisma.color.create({ data: { name, value, storeId: params.storeId } });
    return Response.json(color);
  } catch (err) {
    return NextResponse.json("Interal error", { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

  try {
    const color = await prisma.color.findMany({ where: { storeId: params.storeId } });
    return NextResponse.json(color)
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}