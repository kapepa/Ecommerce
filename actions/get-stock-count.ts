import prisma from "@/lib/db";

const getStockCount = async (storeId: string) => {
  const stockCount = await prisma.product.count({
    where: {
      storeId,
      isArchived: false,
    }
  });

  return stockCount;
}

export { getStockCount };