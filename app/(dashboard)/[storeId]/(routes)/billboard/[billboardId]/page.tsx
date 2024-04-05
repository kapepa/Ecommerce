import prisma from "@/lib/db";
import { NextPage } from "next";
import { BillboardForm } from "./components/billboard-form";

interface BillboardIdProps {
  params: { billboardId: string }
}

const BillboardId: NextPage<BillboardIdProps> = async (props) => {
  const { params } = props;
  const billboard = await prisma.billboard.findUnique({ where: { id: params.billboardId } });

  return (
    <div
      className="flex-col"
    >
      <div
        className="flex-1 space-y-4 p-8"
      >
        <BillboardForm
          initialData={billboard}
        />
      </div>
    </div>
  )
}

export default BillboardId;