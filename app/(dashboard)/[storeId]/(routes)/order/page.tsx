import prisma from "@/lib/db";
import { formatter } from "@/lib/utils";
import { NextPage } from "next";
import { format } from "date-fns";
import { OrderColumns } from "./components/columns";
import { OrderClient } from "./components/product-client";

interface OrderPageProps {
  params: { storeId: string }
}

const OrderPage: NextPage<OrderPageProps> = async (props) => {
  const { params } = props;
  const orders = await prisma.order.findMany({ 
    where: { storeId: params.storeId },
    include: {
      orderItem: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createAt: "desc"
    }
  });

  const formatOrders: OrderColumns[] = orders.map(ord => ({
    id: ord.id,
    phone: ord.phone,
    address: ord.address,
    isPaid: ord.isPaid,
    products: ord.orderItem.map(item => item.product.name).join(", "),
    totalPrice: formatter.format(ord.orderItem.reduce((total, item) => {
      return total + Number(item.product.price);
    }, 0)),
    createAt: format(ord.createAt, "MMMM do, yyyy")
  }))


  return (
    <div 
      className="flex-col"
    >
      <div
        className="flex-1 space-y-8 p-8 pt-6"
      >
        <OrderClient
          data={formatOrders}
        />
      </div>
    </div>
  )
}

export default OrderPage;