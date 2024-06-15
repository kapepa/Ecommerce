import prisma from "@/lib/db";
import { NextPage } from "next";

import { format } from "date-fns";
import { ru } from 'date-fns/locale'
import { CategoryColumn } from "./components/columns";
import { CategoriesClient } from "./components/categorys-client";

const CategoriesPage: NextPage = async () => {
  const categorys = await prisma.category.findMany({ 
    orderBy: { createAt: "desc" },
  })

const formattedCategories: CategoryColumn[] = categorys.map(category => ({
  id: category.id,
  url: category.url,
  ruName: category.ruName,
  uaName: category.uaName,
  createdAt: format(category.createAt, "MMMM do, yyyy", { locale: ru })
}))

  return (
    <div 
      className="flex-col"
    >
      <div
        className="flex-1 space-y-8 p-8 pt-6"
      >
        <CategoriesClient
          data={formattedCategories}
        />
      </div>
    </div>
  )
}

export default CategoriesPage;