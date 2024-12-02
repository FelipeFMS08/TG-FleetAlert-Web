"use client";

import { NavBarComponent } from "@/components/shared/navbar/navbar-component";
import { SelectTracking } from "@/components/tracking/select-tracking/select-tracking";
import { RouteTrackingResponse } from "@/dto/responses/routes.response";
import { getRoutesByManagerId, getRoutesByUserId } from "@/services/routes.service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";  // Importando o Skeleton
import { ModeToggle } from "@/components/shared/toggle";

export default function SelectTrackingPage() {
  const { data: session, status } = useSession();
  const [routes, setRoutes] = useState<RouteTrackingResponse[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      fetchRoutesByManagerId();
    }
  }, [status]);

  async function fetchRoutesByManagerId() {
    if (session?.user?.role === "MEMBER") {
      const data = await getRoutesByUserId(session?.user?.id!);
      setRoutes(data);
    } else {
      const data = await getRoutesByManagerId();
      setRoutes(data);
    }

  }

  function handleRouteSelect(route: RouteTrackingResponse) {
    router.push(`/tracking/${route.route.id}`);
  }

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      <NavBarComponent />
      <div className="w-screen mt-2 flex flex-col ml-32 mr-10 gap-3">

        {routes === null ? (
          <>
            <Skeleton className="w-full p-4 rounded-lg mb-10" />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-lg">
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
              <div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-lg">
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
              <div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-lg">
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
              <div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-lg">
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 mb-10">Selecione a rota que deseja ver.</h1>
            <SelectTracking data={routes} onSelectRoute={handleRouteSelect} />
          </>
        )}
      </div>
      <div className="absolute bottom-3 right-3">
        <ModeToggle />
      </div>
    </div>
  );
}
