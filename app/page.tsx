import Dashboard from "@/components/Dashboard/Dashboard";
import { Metadata } from "next";
import dotenv from 'dotenv';

dotenv.config();
export const metadata: Metadata = {
  title: "AI powered Safe Community App",
  description: "AI powered application to improve safety in communities and Universities.",
  // other metadata
};

export default function Home() {

  return (
    <>
      <Dashboard />
    </>
  );
}
