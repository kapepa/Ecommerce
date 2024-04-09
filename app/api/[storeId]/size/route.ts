import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST (req: Request, { params }: { params: { storeId: string } }) {
  const { userId } : { userId: string | null } = auth();
  const body = await req.json();
  const { name, value } = body;

  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  if (!name) return new NextResponse("Name is required", { status: 400 });
  if (!value) return new NextResponse("Value is required", { status: 400 });
  if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

  try {
    const storeExisting = await prisma.store.findFirst({ where: { id: params.storeId } });
    if (!storeExisting) return new NextResponse("Store does not existing", { status: 403 });

    const size = await prisma.size.create({ data: { name, value, storeId: storeExisting.id } });
    return NextResponse.json(size)
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

  try {
    const size = await prisma.size.findMany({ where: { storeId: params.storeId } });
    return NextResponse.json(size)
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}