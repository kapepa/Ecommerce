import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET (req: Request, {params}: {params: {id: string}}){
  if (!params.id) return new Response("Требуется идентификатор категории", { status: 400 });

  try {
    const sizes = await prisma.size.findMany({ 
      where: {
        product: {
          some: {
            category: {
              id: params.id,
            }
          }
        }
      }
    });

    return NextResponse.json(sizes);
  } catch (error) {
    return new NextResponse("Интервальная ошибка", { status: 500 })
  }
}