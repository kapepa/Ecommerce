import prisma from "@/lib/db";
import { NextPage } from "next";
import { CategoryForm } from "./components/category-form";

interface CategoryPageProps {
  params: { categoryId: string }
}

const CategoryPage: NextPage<CategoryPageProps> = async (props) => {
  const { params } = props;
  const category = await prisma.category.findFirst({ 
    where: { id: params.categoryId } 
  });

  return (
    <div
      className="flex-col"
    >
      <div
        className="flex-1 space-y-4 p-8"
      >
        <CategoryForm
          initialData={category}
        />
      </div>
    </div>
  )
}

export default CategoryPage;