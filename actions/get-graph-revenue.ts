import { GraphDataInt } from "@/interface/graph-data";
import prisma from "@/lib/db"

const getGraphRevenue = async (storeId: string) => {
  const paidOrder = await prisma.order.findMany({
    where: {
      storeId
    },
    include: {
      orderItem: {
        include: {
          product: true
        }
      }
    }
  });

  const monthlyRevenue: { [key: string]: number } = {};

  for (const order of paidOrder) {
    const month = order.createAt.getMonth();
    let revenueForOrder = 0;

    for (const item of order.orderItem) {
      revenueForOrder += item.product.price.toNumber();
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  const graohData: GraphDataInt[] = [
    { name: "Jan", uv: 0 },
    { name: "Feb", uv: 0 },
    { name: "Mar", uv: 0 },
    { name: "Apr", uv: 0 },
    { name: "May", uv: 0 },
    { name: "Jun", uv: 0 },
    { name: "Jul", uv: 0 },
    { name: "Sep", uv: 0 },
    { name: "Nov", uv: 0 },
    { name: "Dec", uv: 0 },
  ];

  for (const month in monthlyRevenue) {
    graohData[parseInt(month)].uv = monthlyRevenue[parseInt(month)]
  }

  return graohData;
}

export { getGraphRevenue }