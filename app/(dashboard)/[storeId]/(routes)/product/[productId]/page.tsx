import prisma from "@/lib/db";
import { NextPage } from "next";
import { ProductForm } from "./components/product-form";

interface ProductIdPageProps {
  params: { productId: string, storeId: string },
}

const ProductIdPage: NextPage<ProductIdPageProps> = async (props) => {
  const { params } = props;
  const product = await prisma.product.findUnique({ 
    where: { id: params.productId },
    include: { image: true },
  });
  const categories = await prisma.category.findMany({
    where: { storeId: params.storeId },
  })
  const sizes = await prisma.size.findMany({
    where: { storeId: params.storeId },
  })
  const colors = await prisma.color.findMany({
    where: { storeId: params.storeId },
  })

  return (
    <div
      className="flex-col"
    >
      <div
        className="flex-1 space-y-4 p-8"
      >
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  )
}

export default ProductIdPage;