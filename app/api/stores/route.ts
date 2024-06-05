import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST (req: Request) {
  const {userId} = auth();
  const body = await req.json();
  const { name } = body;
 
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  if (!name) return new NextResponse("Name is required", { status: 400 });
 
  try {

    return NextResponse.json("SUccess", { status: 200 });
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}