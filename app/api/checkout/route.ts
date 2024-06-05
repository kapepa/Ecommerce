import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
}

export async function OPTIONS() {
  return NextResponse.json({},{ headers: corsHeaders })
}

export async function POST( req: Request ) {
  try {
    const { productIds, info } = await req.json();
    if (!productIds || productIds.length === 0 ) return NextResponse.json("Требуются идентификаторы продуктов", { status: 400 });

    const products = await prisma.product.findFirst({ where: { id: { in: productIds } } } );
    if (!products) return NextResponse.json("Продукт не найден", { status: 400 });

    const order = await prisma.order.create({
      data: {
        isPaid: false,
        ...info,
        orderItem: {
          create: productIds.map((productId: string) => ({
            product: { 
              connect: { id: productId }
            }
          }))
        }
      }
    })

    return NextResponse.json({ success: true }, { headers: corsHeaders,  status: 201 })
  } catch (error) {
    return NextResponse.json({ canceled: true }, { headers: corsHeaders, status: 400 })
  }
}