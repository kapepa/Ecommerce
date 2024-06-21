import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
}

export async function OPTIONS() {
  return NextResponse.json({},{ headers: corsHeaders })
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { ruName, uaName, meta, ruDescription, uaDescription, price, isFeatured, isArchived, categoryId, sizeId, colorId, image } = body;

    if (!ruName) return NextResponse.json("Требуется имя RU", { status: 400 });
    if (!uaName) return NextResponse.json("Требуется имя UA", { status: 400 });
    if (!price) return NextResponse.json("Требуется цена", { status: 400 });
    if (!categoryId) return NextResponse.json("Требуется категория", { status: 400 });
    if (!ruDescription) return NextResponse.json("Требуется описание RU", { status: 400 });
    if (!uaDescription) return NextResponse.json("Требуется описание UA", { status: 400 });
    if (!sizeId) return NextResponse.json("Требуется размер", { status: 400 });
    if (!colorId) return NextResponse.json("Требуется цвет", { status: 400 });
    if (!userId) return NextResponse.json("Неавторизованный", { status: 401 });
    if (!image || !image.length) return NextResponse.json("Требуется изображения", { status: 400 });

    const product = await prisma.product.create({ 
      data: { 
        ruName, 
        uaName,
        meta, 
        ruDescription, 
        uaDescription,
        price, 
        categoryId, 
        sizeId, 
        colorId,
        isFeatured, 
        isArchived,
        image: {
          createMany: {
            data: [
              ...image.map((image: { url: string }) => ({ url: image.url }))
            ]
          }
        } 
      } 
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json("Запрещенный продукт POST", { status: 403  })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const colorId = searchParams.get("colorId");
    const sizeId = searchParams.get("sizeId");
    const isFeatured = searchParams.get("isFeatured");
    const locale = searchParams.get("locale")
    const take = searchParams.get("take") ? Number(searchParams.get("take")) : 10;
    const skip = searchParams.get("skip") ? Number(searchParams.get("skip")) : 0;

    const isRu = locale === "ru";
    const isUA = locale === "ua";
  
    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId ?? undefined,
        colorId: colorId ?? undefined,
        sizeId: sizeId ?? undefined,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      select: {
        id: true,
        ruName: isRu,
        uaName: isUA,
        price: true,
        image: true,
        category: {
          select: {
            id: true,
            ruName: isRu,
            uaName: isUA,
          }
        },
        color: true,
        size: true,

      },
      orderBy: {
        createAt: "desc"
      },
      take,
      skip,
    });

    return Response.json(products, { status: 200, headers: corsHeaders })
  } catch (error) {
    return NextResponse.json("Запрещенный продукт POST", { status: 403  })
  }
}