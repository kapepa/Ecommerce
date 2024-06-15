import prisma from "@/lib/db";
import { NextPage } from "next";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ProductClient } from "./components/product-client";
import { ProductColumn } from "./components/columns";

const ProductPage: NextPage= async () => {
  const products = await prisma.product.findMany({ 
    include: { category: true, size: true, color: true },
    orderBy: { createAt: "desc" },
  })

  const formattedProduct: ProductColumn[] = products.map(pro => ({
    id: pro.id,
    ruName: pro.ruName,
    uaName: pro.uaName,
    ruDescription: pro.ruDescription,
    uaDescription: pro.uaDescription,
    meta: pro.meta, 
    price: Number(pro.price),
    isFeatured: pro.isFeatured,
    isArchived: pro.isArchived,
    category: pro.category.ruName,
    size: pro.size.ruName,
    color: pro.color.url,
    createAt: format(pro.createAt, "MMMM do, yyyy", { locale: ru })
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