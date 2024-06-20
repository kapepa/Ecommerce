import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const origin =  process.env.FRONTEND_STORE_URL

export async function GET (req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale");
    const ids = searchParams.get("ids")?.split(",");
    
    const isRu = locale === "ru";
    const isUa = locale === "ua";
    
    const product = await prisma.product.findMany({
      where: {
        id: {
          in: ids
        }
      },
      select: {
        id: true,
        ruName: isRu,
        uaName: isUa,
        image: true,
        price: true,
        ruDescription: isRu,
        uaDescription: isUa,
        size: {
          select: {
            id: true,
            ruName: isRu,
            uaName: isUa,
            value: true,
          }
        },
        color: {
          select: {
            id: true,
            url: true,
            ruName: isRu,
            uaName: isUa,
          }
        },
      }
    })

    return NextResponse.json(product, { 
      status: 200, 
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch {
    return NextResponse.json("Интервальная ошибка", { status: 500 })
  }
}