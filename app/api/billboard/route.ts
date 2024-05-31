import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST (req: Request) {
  const {userId} = auth();
  const body = await req.json();
  const { label, imageUrl } = body;
 
  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  if (!label) return new NextResponse("Label is required", { status: 400 });
  if (!imageUrl) return new NextResponse("ImageUrl is required", { status: 400 });

  try {
    const billboard = await prisma.billboard.create({ data: { label, imageUrl } })
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}

export async function GET (req: Request) {
  try {
    const billboard = await prisma.billboard.findMany()
 
    return Response.json(billboard);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}