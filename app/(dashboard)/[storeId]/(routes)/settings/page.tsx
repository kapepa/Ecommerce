import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextPage } from "next";
import { redirect } from "next/navigation";
import { SettingsFrom } from "./components/settings-form";

interface SettingsPageProps {
  params: { storeId: string }
}

const SettingsPage: NextPage<SettingsPageProps> = async (props) => {
  const { params } = props;
  const { userId } = auth();

  if(!userId) redirect("/sign-in");

  const store = await prisma.store.findFirst({ where: { id: params.storeId, userId } });

  if( !store ) redirect("/");

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsFrom
          initialData={store}
        />
      </div>
    </div>
  )
} 

export default SettingsPage