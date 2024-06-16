import { cloudinaryManyDelete } from "@/lib/cloudinary";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (req: Request, { params }: { params: { productId: string } }) {
  try {
    const url = new URL(req.url);
    const { searchParams } = url;
    const locale = searchParams.get("locale");

    const isRu = locale === "ru";
    const isUa = locale === "ua";

    if(!params.productId) return NextResponse.json("Плохой запрос идентификатора продукта", { status: 400 });

    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      select: {
        id: true,
        ruName: isRu,
        uaName: isUa,
        ruDescription: isRu,
        uaDescription: isUa,
        price: true,
        image: true,
        category: true,
        size: true,
        color: true,
      },
    })

    return Response.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json("Запрещено продукт GET", { status: 403 })
  }
}

export async function PATCH (req: Request, { params }: { params: { productId: string } }) {
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
    if (!params.productId) return NextResponse.json("Плохой запрос идентификатора продукта", { status: 400 });

    await prisma.product.update({
      where: { id: params.productId },
      data: {
        ruName, 
        uaName,
        meta, 
        ruDescription,
        uaDescription,
        price,
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        colorId,
        image: {
          deleteMany: {},
        }
      }
    })

    const product = await prisma.product.update({
      where: { id: params.productId },
      data: {
        image: {
          createMany: {
            data: [
              ...image.map((image: { url: string }) => ({ url: image.url }))
            ]
          }
        }
      }
    })

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json("Запрещено продукт PATCH", { status: 403 })
  }
}

export async function DELETE (req: Request, { params }: { params: { productId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) return NextResponse.json("Неавторизованный", { status: 401 });
    if (!params.productId) return NextResponse.json("Плохой запрос идентификатора продукта", { status: 400 });

    const existingImges = await prisma.image.findMany({ where: { productId: params.productId } })
    if(!!existingImges && !!existingImges.length) await cloudinaryManyDelete(existingImges);
    
    const product = await prisma.product.deleteMany({ 
      where: { id: params.productId }
    })

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    return NextResponse.json("Запрещено DELETE Product", { status: 403 })
  }
}