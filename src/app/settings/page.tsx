'use client';

import { NavBarComponent } from "@/components/shared/navbar/navbar-component";
import { ModeToggle } from "@/components/shared/toggle";
import VehicleResponse from "@/dto/responses/vehicle.response";
import React, { useEffect, useState } from "react";

import { getAllVehicles } from "@/services/vehicle.service";
import { useSession } from "next-auth/react";
import { UserSettingsSkeleton } from "@/components/settings/user-settings/user-settings-skeleton.component";
import { VehicleTableSkeleton } from "@/components/settings/vehicles/vehicle-table-skeleton.component";
import { UserInfosResponse } from "@/dto/responses/userInfos.response";
import { VehicleTableComponent } from "@/components/settings/vehicles/vehicleTable.component";
import { columns } from "@/components/settings/vehicles/vehicle-columns";
import { getAllUsers, getUserInfos } from "@/services/settings.service";
import { UsersResponse } from "@/dto/responses/users.response";
import { UsersTable } from "@/components/settings/users/users-table.component";
import { usersColumns } from "@/components/settings/users/users-columns";
import { UsersTableSkeleton } from "@/components/settings/users/vehicle-table-skeleton.component";
import { UserSettings } from "@/components/settings/user-settings/user-settings.component";
import { RoutesTable } from "@/components/settings/routes/routes-table.component";
import { routeColumns } from "@/components/settings/routes/routes-columns";
import { RouteResponse } from "@/dto/responses/routes.response";
import { getAllRoutes } from "@/services/routes.service";
import { useWebSocket } from "../WebSocketProvider";
import { toast } from "@/hooks/use-toast";

interface DataState {
  userInfos: UserInfosResponse | null;
  vehicles: VehicleResponse[] | null;
  users: UsersResponse[] | null;
  routes: RouteResponse[] | null;
}

export default function Settings() {
  const { data: session, status } = useSession();
  const { alerts } = useWebSocket();

  const [data, setData] = useState<DataState>({
    userInfos: null,
    vehicles: null,
    users: null,
    routes: null,
  });

  useEffect(() => {

    Promise.all([
      fetchVehicles(),
      fetchUserInfos(),
      fetchAllUsers(),
      fetchAllRoutes(),
    ]);

    console.log(data)

  }, [status]);

  async function fetchVehicles() {
    const data = await getAllVehicles();
    setData((previous: any) => ({ ...previous, vehicles: data }));
  }

  async function fetchUserInfos() {
    const data = await getUserInfos();
    console.log(data);
    setData((previous: any) => ({ ...previous, userInfos: data }));
  }

  async function fetchAllUsers() {
    const data = await getAllUsers();
    setData((previous: any) => ({ ...previous, users: data }));
  }

  async function fetchAllRoutes() {
    const data = await getAllRoutes();
    setData((previous: any) => ({ ...previous, routes: data }));
  }

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
    <div className="flex flex-col pl-32 pr-10 min-h-screen bg-white dark:bg-zinc-900">
      <NavBarComponent />
      <div className="mt-2 flex flex-col ">
        {data.userInfos ? (
          <UserSettings data={data.userInfos} setUserInfos={setData} />
        ) :
          (
            <UserSettingsSkeleton />
          )}
      </div>
      {session?.user?.role === "ADMIN" && (
        <>
          <hr className="my-10" />
          <div className="flex flex-col">
            {data.users ? (
              <UsersTable columns={usersColumns} data={data.users} />
            ) :
              (
                <UsersTableSkeleton />
              )}
          </div>
          <hr className="my-10" />
          <div className="flex flex-col">
            {data.vehicles && data.users ? (

              <VehicleTableComponent data={data.vehicles} columns={columns} setVehicles={setData} users={data.users!} />
            ) :
              (
                <VehicleTableSkeleton />
              )}

          </div>
          <hr className="my-10" />
          <div className="flex flex-col">

            {data.users && data.vehicles && data.routes && (
              <RoutesTable columns={routeColumns} data={data.routes} vehicles={data.vehicles} executors={data.users} setRoutes={setData} />
            )}
          </div>
        </>
      )}

      <div className="fixed bottom-3 right-3">
        <ModeToggle />
      </div>
    </div>
  )
}
