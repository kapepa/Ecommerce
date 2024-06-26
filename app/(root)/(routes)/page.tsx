import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-count";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CreditCard, DollarSign, Package } from "lucide-react";
import { NextPage } from "next";
import { formatter } from "@/lib/utils";

const HomePage: NextPage = async () => {
  const totalRevenue = await getTotalRevenue();
  const salesCount = await getSalesCount();
  const stockCount = await getStockCount();
  const graphRevenue = await getGraphRevenue();
  
  return (
    <div
      className="flex-col"
    >
      <div
        className="flex-1 space-y-4 p-8 pt-6"
      >
        <Heading
          title="Приборная панель"
          description="Обзор вашего магазина"
        />
        <Separator/>
        <div
          className="grid gap-4 grid-cols-3"
        >
          <Card>
            <CardHeader
              className="flex flex-row items-center justify-between space-y-0 pb-2" 
            >
              <CardTitle
                className="test-sm font-medium"
              >
                Общая выручка
              </CardTitle>
              <DollarSign
                className="h-4 w-4 text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
              >
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              className="flex flex-row items-center justify-between space-y-0 pb-2" 
            >
              <CardTitle
                className="test-sm font-medium"
              >
                Продажи
              </CardTitle>
              <CreditCard
                className="h-4 w-4 text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
              >
                {`+${salesCount}`}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              className="flex flex-row items-center justify-between space-y-0 pb-2" 
            >
              <CardTitle
                className="test-sm font-medium"
              >
                Продукция в наличии
              </CardTitle>
              <Package
                className="h-4 w-4 text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
              >
                {stockCount}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card
          className="col-span-4"
        >
          <CardHeader>
            <CardTitle>
              Обзор
            </CardTitle>
            <CardContent
              className="pl-2"
            >
              <Overview
                data={graphRevenue}
              />
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default HomePage;