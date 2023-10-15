"use client";
import CommingSoon from "@/components/svg/comming_soon";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: auth, status } = useSession();

  return (
    <div className="p-2 h-full grid place-items-center overflow-auto">

      <div className="relative py-4 pt-8 w-full">
        <CommingSoon className="w-full max-w-[600px] mx-auto" />
        <h1 className="absolute bottom-5 w-full text-2xl font-bold text-center">Work On Progress...</h1>
      </div>

      {status === "unauthenticated" && (
        <div className="flex justify-center mt-4">
          <Button onClick={() => signIn("google", { redirect: false })}>Sign In</Button>
        </div>
      )}

      <div className="mt-4 mb-4 w-full max-w-[600px] mx-auto">
        <h2 className="text-2xl font-bold">What is this?</h2>
        <p className="mt-2 text-muted-foreground">
          This is an fully functional, closed source Admin Dashboard specially crafted for GrowItRapid. It is built on top of Next.js, TailwindCSS, ShadCN UI, and Mongodb. Manage your users, products, orders, and more.
        </p>
      </div>

    </div>
  )
}
