import { Navbar } from "@/components/navbar";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode,
  params: { storeId: string },
}

const DashboardLayout: FC<DashboardLayoutProps> = async (props) => {
  const { userId } = auth();
  const { children,  params } = props;

  if (!userId) redirect("/sign-in");

  const store = await prisma.store.findFirst({ where: { id: params.storeId, userId } });

  if (!store) redirect("/");

  return (
    <div>
      <Navbar/>
      { children }
    </div>
  )
}

export default DashboardLayout;