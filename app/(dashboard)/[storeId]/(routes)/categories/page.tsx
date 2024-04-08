import prisma from "@/lib/db";
import { NextPage } from "next";
import { CategoriesClient } from "./components/categorys-client";
import { CategoryColumn } from "./components/columns";
import { format } from "date-fns";

interface CategoriesPagePage {
  params: { storeId: string }
}

const CategoriesPage: NextPage<CategoriesPagePage> = async (props) => {
  const { params } = props;
  const categorys = await prisma.category.findMany({ 
    where: { storeId: params.storeId },
    include: { billboard: true },
    orderBy: { createAt: "desc" },
  })

const formattedCategories: CategoryColumn[] = categorys.map(category => ({
  id: category.id,
  name: category.name,
  billboardLabel: category.billboard.label,
  createdAt: format(category.createAt, "MMMM do, yyyy")
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