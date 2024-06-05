import prisma from "@/lib/db"

const getTotalRevenue = async () => {
  const paidOrders = await prisma.order.findMany({
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