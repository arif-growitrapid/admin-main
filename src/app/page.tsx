"use client";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: auth, status } = useSession();

  return (
    <main className="min-h-screen p-24">

      Status: {status}
      <br />
      <br />
      {JSON.stringify(auth, null, 2)}

    </main>
  )
}
