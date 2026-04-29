import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "AI powered Safe Community App",
  description: "AI powered application to improve safety in communities and Universities.",
  // other metadata
};

const Settings = () => {
  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          
        </div>
      </div>
    </>
  );
};

export default Settings;
