import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE (req: Request, { params }: { params: { orderId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json("Неаутентифицированный.", { status: 400 });

    const existingOrder = await prisma.order.findUnique({ where: { id: params.orderId } });
    if (!existingOrder) return NextResponse.json("Заказа не существует.", { status: 400 });

    await prisma.order.deleteMany({ where: { id: params.orderId } });

    return NextResponse.json("Заказ был успешно удален.", { status: 200 })
  } catch (error) {
    return NextResponse.json("Что-то пошло не так при удалении заказа.", { status: 400 })
  }
}

export async function PATCH (req: Request, { params }: { params: { orderId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json("Неаутентифицированный.", { status: 400 });

    const existingOrder = await prisma.order.findUnique({ where: { id: params.orderId } });
    if (!existingOrder) return NextResponse.json("Заказа не существует.", { status: 400 });

    const body = await req.json();

    const haveValue = Object.keys(body).every(key => body.hasOwnProperty(key));
    if (!haveValue) return NextResponse.json("Некоторые свойства указаны неверно!", { status: 400 })
    
    await prisma.order.update({
      where: {
        id: existingOrder.id,
      },
      data: body,
    })

    return NextResponse.json("Заказ был успешно обновлён.", { status: 200 })
  } catch (error) {
    return NextResponse.json("Что-то пошло не так при удалении заказа.", { status: 400 })
  }
}