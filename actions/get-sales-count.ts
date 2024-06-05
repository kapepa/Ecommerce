import prisma from "@/lib/db"

const getSalesCount = async () => {
  const paidOrders = await prisma.order.count();

  return paidOrders;
}

export { getSalesCount }