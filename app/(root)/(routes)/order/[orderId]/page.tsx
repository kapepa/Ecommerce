import prisma from "@/lib/db";
import { NextPage } from "next";
import { ProductOrder } from "./components/columns";
import { OrdersClient } from "./components/orders-client";

interface OrderIdPageProps {
  params: {
    orderId: string
  }
}

const OrderIdPage: NextPage<OrderIdPageProps> = async (props) => {
  const { params: { orderId } } = props;
  const order = await prisma.order.findFirst({
    where: {
      id: orderId
    },
    include: {
      orderItem: {
        include: {
          product: {
            include: {
              image: {
                select: {
                  id: true,
                  url: true,
                }
              }
            }
          },
        }
      },
    }
  });

  const productOrder: ProductOrder[] = order!.orderItem.map(item => ({
    id: item.product.id,
    ruName: item.product.ruName,
    price: Number(item.product.price),
    image: item.product.image,
  }));

  return (
    <div 
      className="flex-col"
    >
      <div
        className="flex-1 space-y-8 p-8 pt-6"
      >
        <OrdersClient
          orderId={orderId}
          isDone={order!.isDone}
          data={productOrder}
        />
      </div>
    </div>
  )
}

export default OrderIdPage;