"use client";

import { NavBarComponent } from "@/components/shared/navbar/navbar-component";
import { ModeToggle } from "@/components/shared/toggle";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@/components/shared/navbar/item-menu-component";
import { BookmarkIcon, CompassIcon, DoorOpenIcon, HomeIcon, SettingsIcon } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const { alerts } = useWebSocket();
  const { toast } = useToast()

  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    } else {
      router.push('/account/login')
    }
  }, [status, router]);

  useEffect(() => {
    const newAlert = alerts.findLast(alert => alert);
    if (newAlert) {
      toast({
        variant: "destructive",
        title: "Opa, você recebeu um alerta!",
        description: `Parece que teve um desvio de rota na rota ${newAlert?.routeName}!`
      })
    }
  }, [alerts])


  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900 ">
      <NavBarComponent />
      <div className="ml-24 flex flex-col items-center justify-center w-full p-4 overflow-y-auto max-h-screen">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          <div
            className="cursor-pointer p-10 bg-white dark:bg-zinc-800 rounded-lg shadow-lg hover:bg-red-100 dark:hover:border-primary border transition-all w-full"
            onClick={() => router.push("/")}
          >
            <div className="flex flex-col gap-2 items-center">
              <HomeIcon className="h-7 w-7" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Início</h3>
            </div>
          </div>
          {
            session?.user?.role !== "MEMBER" && (
              <>
                <div
                  className="cursor-pointer p-10 bg-white dark:bg-zinc-800 rounded-lg shadow-lg hover:bg-red-100 dark:hover:border-primary border transition-all w-full"
                  onClick={() => router.push("/tracking")}
                >
                  <div className="flex flex-col gap-2 items-center">
                    <CompassIcon className="h-7 w-7" />
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">Rastreamento</h3>
                  </div>
                </div>

                <div
                  className="cursor-pointer p-10 bg-white dark:bg-zinc-800 rounded-lg shadow-lg hover:bg-red-100 dark:hover:border-primary border transition-all w-full"
                  onClick={() => router.push("/reports")}
                >
                  <div className="flex flex-col gap-2 items-center">
                    <BookmarkIcon className="h-7 w-7" />
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">Relatórios</h3>
                  </div>
                </div>
              </>
            )
          }

          <div
            className="cursor-pointer p-10 bg-white dark:bg-zinc-800 rounded-lg shadow-lg hover:bg-red-100 dark:hover:border-primary border transition-all w-full"
            onClick={() => router.push("/settings")}
          >
            <div className="flex flex-col gap-2 items-center">
              <SettingsIcon className="h-7 w-7" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Configurações</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 right-3">
        <ModeToggle />
      </div>
    </div>
  );
}
