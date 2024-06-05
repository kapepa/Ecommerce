import prisma from "@/lib/db";

const getStockCount = async () => {
  const stockCount = await prisma.product.count({
    where: {
      isArchived: false,
    }
  });

  return stockCount;
}

export { getStockCount };