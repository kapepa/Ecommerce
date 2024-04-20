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
  const store = await prisma.store.findFirst({ where: { id: "d3db22fa-5154-49a2-b5fb-eae456fbe914" } });

  if (store) redirect(`/${store.id}`);
  
  return (
    <>
      {children}
    </>
  )
}

export default RootLayout;