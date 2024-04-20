import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE (req: Request, { params }: { params: { orderId: string, storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json("Unauthenticated", { status: 400 });

    const existingOrder = await prisma.order.findUnique({ where: { id: params.orderId } });
    if (!existingOrder) return NextResponse.json("The order does not exist.", { status: 400 });

    await prisma.order.deleteMany({ where: { id: params.orderId, storeId: params.storeId } });

    return NextResponse.json("The order was successfully deleted.", { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json("Something went wrong while delete order.", { status: 400 })
  }
}