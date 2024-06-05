import prisma from "@/lib/db";
import { NextPage } from "next";
import { ColorForm } from "./components/color-form";

interface ColorIdPageProps {
  params: { colorId: string }
}

const ColorIdPage: NextPage<ColorIdPageProps> = async (props) => {
  const { params } = props;
  const color = await prisma.color.findFirst({ where: { id: params.colorId } })

  return (
    <div
      className="flex-col"
    >
      <div
        className="flex-1 space-y-4 p-8"
      >
        <ColorForm
          initialData={color}
        />
      </div>
    </div>
  )
}

export default ColorIdPage;