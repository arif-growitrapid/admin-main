"use client";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: auth, status } = useSession();

  return (
    <div className="p-5 grid place-items-center h-full">

      <h1 className="text-2xl font-bold">
        Will Be Added Soon...
      </h1>

      <Button onClick={() => {
        signIn("google", { redirect: false });
      }}>Signin</Button>

    </div>
  )
}
