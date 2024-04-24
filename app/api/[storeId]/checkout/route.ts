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

export async function POST( req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { productIds, info } = await req.json();
    if (!productIds || productIds.length === 0 ) return NextResponse.json("Product ids are required", { status: 400 });

    const products = await prisma.product.findFirst({ where: { id: { in: productIds } } } );
    if (!products) return NextResponse.json("Product is not found", { status: 400 });

    const order = await prisma.order.create({
      data: {
        storeId: params.storeId,
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