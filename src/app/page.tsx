"use client";

import { NavBarComponent } from "@/components/shared/navbar/navbar-component";
import { ModeToggle } from "@/components/shared/toggle";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    console.log(session)
    if (status === 'authenticated') {
      router.push('/');
    } else {
      router.push('/account/login')
    }
  }, [status, router]);


  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      <NavBarComponent />


      <div className="absolute bottom-3 right-3">
        <ModeToggle />
      </div>
    </div>
  );
}
