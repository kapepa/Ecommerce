import prisma from "@/lib/db";
import { NextPage } from "next";
import { SizeColumn } from "./components/columns";
import { format } from "date-fns";
import { SizeClient } from "./components/size-client";

interface CategoriesPagePage {
  params: { storeId: string }
}

const SizePage: NextPage<CategoriesPagePage> = async (props) => {
  const { params } = props;
  const sizes = await prisma.size.findMany({ 
    where: { storeId: params.storeId },
    orderBy: { createAt: "desc" }, 
  });

  const formattedSize: SizeColumn[] = sizes.map(size => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createAt, "MMMM do, yyyy")
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