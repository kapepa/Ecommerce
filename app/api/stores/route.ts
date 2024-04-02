import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default async function(req: Request) {
  const {userId, getToken} = auth();
  const body = await req.json();
  const { name } = body;
 
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  if (!name) return new NextResponse("Name is required", { status: 400 });
 
  try {
    const store = await prisma.store.create({ data: { name, userId } })
 
    return Response.json(store);
  } catch (error) {
    return new NextResponse("Interal error", { status: 500 })
  }
}