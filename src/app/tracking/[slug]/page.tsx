"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useWebSocket } from "@/app/WebSocketProvider";
import { getRouteById, getRoutesByManagerId, getRoutesByUserId } from "@/services/routes.service";
import { AlertResponse, RouteTrackingResponse } from "@/dto/responses/routes.response";
import { AlertCircleIcon } from "lucide-react";
import FleetMap from "@/components/tracking/fleet-map.component";
import { UserInfoTrack } from "@/components/tracking/tracking-components/user-info-track.component";
import { DriverScoreTrack } from "@/components/tracking/tracking-components/driver-score-track.component";
import { NavBarComponent } from "@/components/shared/navbar/navbar-component";
import { ModeToggle } from "@/components/shared/toggle";
import { Skeleton } from "@/components/ui/skeleton"; // Importando o Skeleton
import L from "leaflet";
import { PreviewRoute } from "@/components/settings/routes/preview-route.component";

export default function RouteDetailPage({ params }: { params: { slug: string } }) {
  const { data: session, status } = useSession();
  const { alerts, userLocations } = useWebSocket();
  const [selectedRoute, setSelectedRoute] = useState<RouteTrackingResponse | null>(null);
  const [allAlerts, setAllAlerts] = useState<any[]>(selectedRoute?.route?.alerts!);
  const [highlightedAlert, setHighlightedAlert] = useState<number | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchRouteById(parseInt(params.slug));
    }
  }, [status, params.slug]);

  useEffect(() => {
    if (alerts.length > 0 && selectedRoute) {
      const newAlerts = alerts.map((alert) => {
        const { latitude, longitude } = alert.location;
        return {
          ...alert,
          location: L.latLng(latitude, longitude),
        };
      });

      setAllAlerts((prevAlerts) => [...prevAlerts, ...newAlerts]);
    }
  }, [alerts])

  useEffect(() => {
    if (userLocations.length > 0 && selectedRoute) {
      const lastLocation = userLocations.findLast(location => location);
      setSelectedRoute((previewRoute: any) => {
        if (!previewRoute) {
          return null; 
        }
      
        return {
          ...previewRoute, 
          route: {
            ...previewRoute.route, 
            status: lastLocation?.status
          },
        };
      });
      

    }


  }, [userLocations]);

  async function fetchRouteById(id: number) {
    let data;
    if (session?.user?.role === "MEMBER") {
      data = await getRoutesByUserId(session?.user?.id!);
    } else {
      data = await getRoutesByManagerId();
    }

    const findData = data.find(route => route.route.id === id);
    setSelectedRoute(findData!);
    setAllAlerts(findData?.route.alerts!);
  }

  const highlightMapArea = (alertId: number) => {
    setHighlightedAlert(alertId);
  };

  const removeHighlight = () => {
    setHighlightedAlert(null);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      <NavBarComponent />
      {selectedRoute ? (
        <div className="grid grid-cols-[1fr_1fr_0.1fr] grid-row-3 grid-flow-row-dense gap-4 pl-32 pr-10 pb-14 pt-2">
          <div className="md:block hidden">
            <UserInfoTrack data={selectedRoute.route} />
          </div>
          <div className="md:block hidden">
            <DriverScoreTrack userId={selectedRoute.user.id} userName={selectedRoute.user.name} />
          </div>
          <div className="md:block hidden dark:bg-zinc-800 bg-zinc-100 p-4 col-span-2 row-span-2 rounded-md h-[25rem] overflow-y-auto">
            {allAlerts?.map((alert, index) =>
              alert.routeId === selectedRoute.route.id && (
                <div
                  key={index}
                  className="relative bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow hover:bg-red-100 cursor-pointer transition-all mb-4"
                  onMouseEnter={() => highlightMapArea(alert.id)}
                  onMouseLeave={() => removeHighlight()}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-red-600 text-xl">
                      <AlertCircleIcon />
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold text-red-600">
                        {alert.message || "Geofencing Alert"}
                      </h4>
                      <p className="text-sm text-red-800">
                        O veículo saiu da área de geofencing designada. Verifique a localização.
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="grid mgrid-cols-subgrid gap-4 md:row-span-3 rounded-md relative z-0">
            <FleetMap data={selectedRoute.route} highlightedAlert={highlightedAlert} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_1fr_0.1fr] grid-row-3 grid-flow-row-dense gap-4 pl-32 pr-10 pb-14 pt-2 w-full">
          <div className="md:block hidden">
            <Skeleton className="w-full mb-4 rounded-md h-72" />
          </div>
          <div className="md:block hidden">
            <Skeleton className="w-full mb-4 h-72" />
          </div>
          <div className="md:block hidden dark:bg-zinc-800 bg-zinc-100 p-4 col-span-2 row-span-2 rounded-md h-[25rem] overflow-y-auto">
            <Skeleton className="h-[4rem] w-full mb-4 rounded-lg" />
            <Skeleton className="h-[4rem] w-full mb-4 rounded-lg" />
            <Skeleton className="h-[4rem] w-full mb-4 rounded-lg" />
          </div>

          <div className="grid mgrid-cols-subgrid gap-4 md:row-span-3 rounded-md relative z-0 ">
            <Skeleton className="rounded-md md:min-w-[500px] max-w-[350px]" />
          </div>
        </div>
      )}
      <div className="absolute bottom-3 right-3">
        <ModeToggle />
      </div>
    </div>
  );
}
