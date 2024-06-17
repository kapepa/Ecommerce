import { NextResponse } from "next/server";

export async function GET (req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids");
    console.log(ids);

    return NextResponse.json([1,2,3], { status: 200 });
  } catch {
    return NextResponse.json("Интервальная ошибка", { status: 500 })
  }
}