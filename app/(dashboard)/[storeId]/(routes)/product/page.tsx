import prisma from "@/lib/db";
import { NextPage } from "next";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { ProductClient } from "./components/product-client";

interface ProductPageProps {
  params: { storeId: string }
}

const ProductPage: NextPage<ProductPageProps> = async (props) => {
  const { params } = props;
  const products = await prisma.product.findMany({ 
    where: { storeId: params.storeId },
    include: { category: true, size: true,  color: true },
    orderBy: { createAt: "desc" },
  })

  const formattedProduct: ProductColumn[] = products.map(pro => ({
    id: pro.id,
    name: pro.name,
    price: formatter.format(pro.price.toNumber()),
    isFeatured: pro.isFeatured,
    isArchived: pro.isArchived,
    category: pro.category.name,
    size: pro.size.name,
    color: pro.color.value,
    createAt: format(pro.createAt, "MMMM do, yyyy")
  }))

  return (
    <div 
      className="flex-col"
    >
      <div
        className="flex-1 space-y-8 p-8 pt-6"
      >
        <ProductClient
          data={formattedProduct}
        />
      </div>
    </div>
  )
}

export default ProductPage;