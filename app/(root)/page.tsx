import { UserButton } from "@clerk/nextjs";
import { NextPage } from "next";

const SetupPage: NextPage = () => {
  return (
    <div className="p-4">
      <UserButton 
        afterSignOutUrl="/"
      />
    </div>
  )
}

export default SetupPage;