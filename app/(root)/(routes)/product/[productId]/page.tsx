import prisma from "@/lib/db";
import { NextPage } from "next";
import { Decimal } from "@prisma/client/runtime/library";
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
  const categories = await prisma.category.findMany()
  const sizes = await prisma.size.findMany()
  const colors = await prisma.color.findMany()

  const initialData = !!product
    ? {
        ...product,
        price: Number(product.price) as unknown as Decimal
      }
    : null

  return (
    <div
      className="flex-col"
    >
      <div
        className="flex-1 space-y-4 p-8"
      >
        <ProductForm
          initialData={initialData}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  )
}

export default ProductIdPage;