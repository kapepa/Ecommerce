import prisma from "@/lib/db";
import { NextPage } from "next";

interface DashboardPageProps {
  params: { storeId: string }
}

const DashboardPage: NextPage<DashboardPageProps> = async (props) => {
  const { params } = props;
  const store = await prisma.store.findFirst({ where: { id: params.storeId } })

  return (
    <div>
      Active Store { store?.name }
    </div>
  )
}

export default DashboardPage;