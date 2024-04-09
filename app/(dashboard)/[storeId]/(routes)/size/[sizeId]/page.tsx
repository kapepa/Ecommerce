import prisma from "@/lib/db";
import { NextPage } from "next";
import { SizeForm } from "./components/size-form";

interface SizeIdProps {
  params: { sizeId: string }
}

const SizeIdPage: NextPage<SizeIdProps> = async (props) => {
  const { params } = props;
  const size = await prisma.size.findFirst({ 
    where: { id: params.sizeId },
  });

  return (
    <div
      className="flex-col"
    >
      <div
        className="flex-1 space-y-4 p-8"
      >
        <SizeForm
          initialData={size}
        />
      </div>
    </div>
  )
}

export default SizeIdPage;