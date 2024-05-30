
import { cloudinaryDelete } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function DELETE (req: Request, { params }: { params: { name: string } }) {
  try {
    await cloudinaryDelete(params.name, true);

    return new NextResponse("Imge was success deleted.", { status: 200 })
  } catch (err) {
    return new NextResponse("Interal error", { status: 500 })
  }
}