import prisma from "@/lib/db";
import { NextPage } from "next";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';
import { SizeColumn } from "./components/columns";
import { SizeClient } from "./components/size-client";

const SizePage: NextPage= async () => {
  const sizes = await prisma.size.findMany({ 
    orderBy: { createAt: "desc" }, 
  });

  const formattedSize: SizeColumn[] = sizes.map(size => ({
    id: size.id,
    ruName: size.ruName,
    uaName: size.uaName,
    value: size.value,
    createdAt: format(size.createAt, "MMMM do, yyyy", { locale: ru })
  }))

  return (
    <div 
      className="flex-col"
    >
      <div
        className="flex-1 space-y-8 p-8 pt-6"
      >
        <SizeClient
          data={formattedSize}
        />
      </div>
    </div>
  )
}

export default SizePage;