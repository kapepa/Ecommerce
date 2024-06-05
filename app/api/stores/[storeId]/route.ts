import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH (req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

    return NextResponse.json("Success", { status: 200 });
  } catch(err) {
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE (req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

    return NextResponse.json("Success", { status: 200 });
  } catch(err) {
    return new NextResponse("Internal error", { status: 500 })
  }
}