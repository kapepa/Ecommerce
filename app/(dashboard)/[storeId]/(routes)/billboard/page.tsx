import { NextPage } from "next";
import { BillboardClient } from "./components/billboard-client";
import prisma from "@/lib/db";
import { BillboardColumn } from "./components/columns";
import { format } from "date-fns";

interface BillboardPageProps {
  params: { storeId: string }
}

const BillboardPage: NextPage<BillboardPageProps> = async (props) => {
  const { params } = props;
  const billboards = await prisma.billboard.findMany({ 
    where: { storeId: params.storeId }, 
    orderBy: { createAt: "desc" },
  });

  const fortattedBillboard: BillboardColumn[] = billboards.map(item => ({
    id: item.id,
    label: item.label,
    createAt: format(item.createAt, "MMMM do, yyyy")
  }));

  return (
    <div 
      className="flex-col"
    >
      <div
        className="flex-1 space-y-8 p-8 pt-6"
      >
        <BillboardClient
          data={fortattedBillboard}
        />
      </div>
    </div>
  )
}

export default BillboardPage;