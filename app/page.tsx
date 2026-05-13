
import { Metadata } from "next";
import dotenv from 'dotenv';
import SignIn from "./auth/signin/page";


dotenv.config();
 

export default function Page() {
  return (
    <>
      <SignIn/>
    </>
  );
}
