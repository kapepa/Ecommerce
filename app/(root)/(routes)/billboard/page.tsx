import { NextPage } from "next";
import prisma from "@/lib/db";
import { format } from "date-fns";
import { ru } from 'date-fns/locale'
import { BillboardColumn } from "./components/columns";
import { BillboardClient } from "./components/billboard-client";

const BillboardPage: NextPage = async () => {
  const billboards = await prisma.billboard.findMany({ 
    orderBy: { createAt: "desc" },
  });

  const fortattedBillboard: BillboardColumn[] = billboards.map(item => ({
    id: item.id,
    label: item.label,
    active: item.active,
    createAt: format(item.createAt, "MMMM do, yyyy", { locale: ru })
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