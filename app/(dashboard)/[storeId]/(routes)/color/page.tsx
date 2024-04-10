import prisma from "@/lib/db";
import { NextPage } from "next";
import { ColorColumn } from "./components/columns";
import { format } from "date-fns";
import { ColorClient } from "./components/color-client";

interface ColorPageProps {
  params: { storeId: string }
}

const ColorPage: NextPage<ColorPageProps> = async (props) => {
  const { params } = props;
  const color = await prisma.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { createAt: "desc" }
  })

  const formattedColor: ColorColumn[] = color.map(col => ({
    id: col.id,
    name: col.name,
    value: col.value,
    createdAt: format(col.createAt, "MMMM do, yyyy"),
  }))

  return (
    <div 
      className="flex-col"
    >
      <div
        className="flex-1 space-y-8 p-8 pt-6"
      >
        <ColorClient
          data={formattedColor}
        />
      </div>
    </div>
  )
}

export default ColorPage;