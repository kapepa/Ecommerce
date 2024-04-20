import prisma from "@/lib/db"

const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prisma.order.findMany({
    where: {
      storeId,
    },
    include: {
      orderItem: {
        include: {
          product: true,
        }
      }
    }
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItem.reduce((orderSum, item) => {
      return orderSum + item.product.price.toNumber();
    }, 0)

    return total + orderTotal;
  }, 0);

  return totalRevenue;
}

export { getTotalRevenue };