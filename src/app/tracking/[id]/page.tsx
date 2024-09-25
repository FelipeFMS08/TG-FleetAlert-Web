"use client";

import { NavBarComponent } from "@/components/shared/navbar/navbar-component";
import { ModeToggle } from "@/components/shared/toggle";
import FleetMap from "@/components/tracking/fleet-map.component";
import { DriverScoreTrack } from "@/components/tracking/tracking-components/driver-score-track.component";
import { UserInfoTrack } from "@/components/tracking/tracking-components/user-info-track.component";
import { useState } from "react";
import { Circle, MapContainer, TileLayer } from "react-leaflet";

export default function TrackingPage({ params }: { params: { slug: string } }) {

    return (
        <div className="flex h-screen bg-white dark:bg-zinc-900">
            <NavBarComponent />
            <div className="grid grid-cols-[1fr_1fr_0.1fr] grid-row-3 grid-flow-row-dense gap-4 pl-32 pr-10 pb-14 pt-2">
                <UserInfoTrack />
                <DriverScoreTrack />
                <div className="bg-zinc-800 p-4 col-span-2 row-span-2 rounded-md h-[25rem]">Em codificação</div>
                <div className="grid grid-cols-subgrid gap-4 row-span-3 rounded-md">
                    <MapContainer
                        className="rounded-md"
                        style={{ height: "100%", width: "500px" }}
                        center={[-23.561682, -46.655898]}
                        zoom={13}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        <FleetMap />

                    </MapContainer>
                </div>
            </div>


            <div className="absolute bottom-3 right-3">
                <ModeToggle />
            </div>
        </div>
    );
}
