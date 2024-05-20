import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode,
}

const RootLayout: FC<RootLayoutProps> = async ({ children }) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  // const store = await prisma.store.findFirst({ where: { userId } });
  // Temporary, need to fix
  const store = await prisma.store.findFirst({ where: { id: "e7fed646-0a7e-4220-bb4c-e7e69ceb5c78" } });

  if (store) redirect(`/${store.id}`);
  
  return (
    <>
      {children}
    </>
  )
}

export default RootLayout;