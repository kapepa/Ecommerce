import prisma from "@/lib/db"

const getSalesCount = async (storeId: string) => {
  const paidOrders = await prisma.order.count({
    where: {
      storeId,
    }
  });

  return paidOrders;
}

export { getSalesCount }