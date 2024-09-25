'use client';

import { columns } from "@/components/settings/vehicles/columns";
import { VehicleTableComponent } from "@/components/settings/vehicles/vehicleTable.component";
import { NavBarComponent } from "@/components/shared/navbar/navbar-component";
import { ModeToggle } from "@/components/shared/toggle";
import { VehicleResponse } from "@/dto/responses/vehicle.response";
import { getAllVehicles } from "@/services/vehicle.service";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

function useMergeState(initialState: any) {
    const [state, setState] = useState(initialState);
    const setMergedState = (newState: any) => 
      setState((prevState: any) => Object.assign({}, prevState, newState)
    );
    return [state, setMergedState];
  }


export default function Settings() {

    const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
    const [userRequest, setUserRequest] = useMergeState({
        loading: false,
        user: null,
      });

      userRequest.loading;
      userRequest.user;

      setUserRequest({...userRequest, user: "Felipe"});

    useEffect(() => {
        const fetchVehicles = async () => {
            const data = await getAllVehicles();;
            setVehicles(data);
        };

        fetchVehicles();
    }, []);

    return (
        <div className="flex h-screen bg-white dark:bg-zinc-900">
            <NavBarComponent />
            <div className="w-screen mt-2 flex flex-col ml-32">
                <VehicleTableComponent data={vehicles} columns={columns} setVehicles={setVehicles} />
            </div>

            <div className="absolute bottom-3 right-3">
                <ModeToggle />
            </div>
        </div>
    )
}