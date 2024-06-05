import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextPage } from "next";
import { redirect } from "next/navigation";
import { SettingsFrom } from "./components/settings-form";

const SettingsPage: NextPage = async () => {
  const { userId } = auth();

  if(!userId) redirect("/sign-in");


  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsFrom/>
      </div>
    </div>
  )
} 

export default SettingsPage