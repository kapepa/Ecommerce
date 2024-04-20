import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (req: Request, { params }: { params: { storeId: string, colorId: string } }) {
  if (!params.colorId) return NextResponse.json("Size id is required", { status: 400 });

  try {
    const color = await prisma.color.findUnique({ where: { id: params.colorId } });
    return color;
  } catch (error) {
    return NextResponse.json("Interal error", { status: 500 })
  }
}

export async function PATCH (req: Request, { params }: { params: { storeId: string, colorId: string } }) {
  const { userId } = auth();
  const body = await req.json();
  const { name, value } = body; 

  if (!userId) return NextResponse.json("Unauthenticated", { status: 400 });
  if (!name) return NextResponse.json("Name is required", { status: 400 });
  if (!value) return NextResponse.json("Value is required", { status: 400 });
  if (!params.storeId) return NextResponse.json("Store id is required", { status: 400 });

  try {
    const storeExisting = await prisma.store.findUnique({ where: { id: params.storeId } });
    if (!storeExisting) return NextResponse.json("Store does not existing", { status: 403 });

    const colorExisting = await prisma.color.findUnique({ where: { id: params.colorId } });
    if (!colorExisting) return NextResponse.json("Color does not existing", { status: 403 });

    const color = await prisma.color.updateMany({ where: { id: params.colorId }, data: { name, value } });
    return NextResponse.json(color);
  } catch (error) {
    return NextResponse.json("Interal error", { status: 500 });
  }
}

export async function DELETE (req: Request, { params }: { params: { storeId: string, colorId: string } }) {
  if (!params.storeId) return NextResponse.json("Color id is required", { status: 400 });

  try {
    const colorExisting = await prisma.color.findUnique({ where: { id: params.colorId } });
    if (!colorExisting) return NextResponse.json("Color does not existing", { status: 403 });

    const color = await prisma.color.deleteMany({ where: { id: params.colorId } });
    return NextResponse.json(color)
  } catch (error) {
    return NextResponse.json("Interal error", { status: 500 });
  }
}