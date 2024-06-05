import { Navbar } from "@/components/navbar";
import { Container } from "@/components/ui/container";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode,
  params: { storeId: string },
}

const RootLayout: FC<RootLayoutProps> = async (props) => {
  const { userId } = auth();
  const { children } = props;

  if (!userId) redirect("/sign-in");

  return (
    <div>
      <Navbar/>
      <Container>
        { children }
      </Container>
    </div>
  )
}

export default RootLayout;