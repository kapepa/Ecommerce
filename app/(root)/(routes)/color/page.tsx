import prisma from "@/lib/db";
import { NextPage } from "next";
import { format } from "date-fns";
import { ru } from 'date-fns/locale'
import { ColorColumn } from "./components/columns";
import { ColorClient } from "./components/color-client";


const ColorPage: NextPage = async () => {
  const color = await prisma.color.findMany({
    orderBy: { createAt: "desc" }
  })

  const formattedColor: ColorColumn[] = color.map(col => ({
    id: col.id,
    url: col.url,
    name: col.name,
    createdAt: format(col.createAt, "MMMM do, yyyy", { locale: ru }),
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