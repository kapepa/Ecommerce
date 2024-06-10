import { FC } from "react";
import { AboutForm } from "./components/about-form";
import prisma from "@/lib/db";

const AboutPage: FC = async () => {
  const about = await prisma.aboutUs.findFirst();

  return (
    <div
    className="flex-col"
  >
    <div
      className="flex-1 space-y-4 p-8"
    >
    <AboutForm
      initialData={about}
    />
    </div>
  </div>
  )
}

export default AboutPage;