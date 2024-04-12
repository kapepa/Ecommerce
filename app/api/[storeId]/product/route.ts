import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, price, isFeatured, isArchived, categoryId, sizeId, colorId, image } = body;
  
    if (!userId) return NextResponse.json("Unauthorized", { status: 401 });
    if (!params.storeId) return NextResponse.json("Not Found Store", { status: 404 })
    if (!name) return NextResponse.json("Request required Name", { status: 400 });
    if (!price) return NextResponse.json("Request required Price", { status: 400 });
    if (!categoryId) return NextResponse.json("Request required Category", { status: 400 });
    if (!sizeId) return NextResponse.json("Request required Size", { status: 400 });
    if (!colorId) return NextResponse.json("Request required Color", { status: 400 });
    if (!image || !image.length) return NextResponse.json("Request required Image", { status: 400 });

    const store = await prisma.store.findUnique({ where: { id: params.storeId }});
    if (!store) return NextResponse.json("Not Found Store", { status: 404 });

    const product = await prisma.product.create({ 
      data: { 
        name, 
        price, 
        storeId: params.storeId, 
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

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json("Forbidden POST Product", { status: 403  })
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const colorId = searchParams.get("colorId");
    const sizeId = searchParams.get("sizeId");
    const isFeatured = searchParams.get("isFeatured");
  
    if (!params.storeId) return NextResponse.json("Not Found Store", { status: 404 });

    const product = prisma.product.findMany({
      where: {
        categoryId: categoryId ?? undefined,
        colorId: colorId ?? undefined,
        sizeId: sizeId ?? undefined,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        image: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createAt: "desc"
      }
    });

    return Response.json(product, { status: 200 })
  } catch (error) {
    return NextResponse.json("Forbidden POST Product", { status: 403  })
  }
}