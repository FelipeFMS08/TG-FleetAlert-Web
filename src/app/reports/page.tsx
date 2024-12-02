"use client";

import { useEffect, useState } from "react";
import { reportsColumns } from "@/components/reports/reports-columns";
import { ReportsTableComponent } from "@/components/reports/reports-table.component";
import { NavBarComponent } from "@/components/shared/navbar/navbar-component";
import { ModeToggle } from "@/components/shared/toggle";
import { ReportsResponse } from "@/dto/responses/reports.response";
import { getRoutesByManagerId } from "@/services/routes.service";
import { UsersTableSkeleton } from "@/components/settings/users/vehicle-table-skeleton.component";

export default function ReportsPage() {
  const [reportsData, setReportsData] = useState<ReportsResponse[] | null>(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        // Chama a função para buscar as rotas pelo ManagerId
        const routes = await getRoutesByManagerId();

        const formattedReports = routes.map(routeTracking => {
            const route = routeTracking.route;
            const user = routeTracking.user;  
            const vehicle = routeTracking.vehicle;
            return {
              route: {
                id: route.id,
                name: route.name,
                geofencinginfos: route.geofencinginfos,
                startAddress: route.startAddress,
                finishAddress: route.finishAddress,
                creator: route.creator,
                creatorid: route.creatorid,
                vehicle: route.vehicle,
                user: route.user,
                status: route.status,
                alerts: route.alerts
              },
              user: {
                id: user.id,
                name: user.name,
                emailVerified: user.emailVerified,
                isFirstLogin: user.isFirstLogin,
                email: user.email,
                role: user.role,
                photo: user.photo,
              },
              vehicle: {
                responsible: vehicle.responsible,
                id: vehicle.id,
                name: vehicle.name,
                signSerial: vehicle.signSerial,
                type: vehicle.type,
                responsibleId: vehicle.responsibleId,
              },
              alerts: route.alerts ? route.alerts.length : 0, 
              time: "", 
            };
          });
          

        setReportsData(formattedReports);  
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchReportsData();
  }, []); 

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900 relative">
      <NavBarComponent />

      <div className="pl-32 pr-10 pb-14 pt-2 w-full">
        { reportsData ? (
            <ReportsTableComponent columns={reportsColumns} data={reportsData} />
        ) : (
            <UsersTableSkeleton />
        )}
      </div>

      <div className="absolute bottom-3 right-3 z-50">
        <ModeToggle />
      </div>
    </div>
  );
}
