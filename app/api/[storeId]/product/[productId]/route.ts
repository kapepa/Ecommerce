import prisma from "@/lib/db";
import { getImageId } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (req: Request, { params }: { params: { storeId: string, productId: string } }) {
  try {
    if(!params.productId) return NextResponse.json("Bad Request Product ID", { status: 400 });

    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        image: true,
        category: true,
        size: true,
        color: true,
      }
    })

    return Response.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json("Forbidden GET Product", { status: 403 })
  }
}

export async function PATCH (req: Request, { params }: { params: { storeId: string, productId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, price, isFeatured, isArchived, categoryId, sizeId, colorId, image } = body;

    if (!name) return NextResponse.json("Request required Name", { status: 400 });
    if (!price) return NextResponse.json("Request required Price", { status: 400 });
    if (!categoryId) return NextResponse.json("Request required Category", { status: 400 });
    if (!sizeId) return NextResponse.json("Request required Size", { status: 400 });
    if (!colorId) return NextResponse.json("Request required Color", { status: 400 });
    if (!userId) return NextResponse.json("Unauthorized", { status: 401 });
    if (!params.productId) return NextResponse.json("Bad Request Product ID", { status: 400 });

    await prisma.product.update({
      where: { id: params.productId },
      data: {
        name, 
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
    return NextResponse.json("Forbidden PATCH Product", { status: 403 })
  }
}

export async function DELETE (req: Request, { params }: { params: { storeId: string, productId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) return NextResponse.json("Unauthorized", { status: 401 });
    if (!params.productId) return NextResponse.json("Bad Request Product ID", { status: 400 });

    const existingImges = await prisma.image.findMany({ where: { productId: params.productId } })

    if(!!existingImges && !!existingImges.length) {
      const extractImageName = existingImges.map((img: any) => getImageId(img.url))
      console.log(extractImageName);
    }
    
    // const product = await prisma.product.deleteMany({ 
    //   where: { id: params.productId }
    // })

    // return NextResponse.json(product, { status: 200 })

    return NextResponse.json("test", { status: 200 })
  } catch (error) {
    return NextResponse.json("Forbidden DELETE Product", { status: 403 })
  }
}