import { NextPage } from "next";
import { BillboardClient } from "./components/billboard-client";

const BillboardPage: NextPage = () => {
  return (
    <div 
      className="flex-col"
    >
      <div
        className="flex-1 space-y-8 p-8 pt-6"
      >
        <BillboardClient/>
      </div>
    </div>
  )
}

export default BillboardPage;