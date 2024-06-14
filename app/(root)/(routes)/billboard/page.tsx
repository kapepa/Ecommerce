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

  const formattedBillboard: BillboardColumn[] = billboards.map(item => ({
    id: item.id,
    ruLabel: item.ruLabel,
    uaLabel: item.uaLabel,
    active: item.active,
    imageUrl: item.imageUrl,
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
          data={formattedBillboard}
        />
      </div>
    </div>
  )
}

export default BillboardPage;