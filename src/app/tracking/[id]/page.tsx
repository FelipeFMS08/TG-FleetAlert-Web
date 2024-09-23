"use client";

import { NavBarComponent } from "@/components/shared/navbar/navbar-component";
import { ModeToggle } from "@/components/shared/toggle";
import FleetMap from "@/components/tracking/fleet-map.component";
import { useState } from "react";
import { Circle, MapContainer, TileLayer } from "react-leaflet";

export default function TrackingPage({ params }: { params: { slug: string } }) {

    return (
        <div className="flex h-screen bg-white dark:bg-zinc-900">
            <NavBarComponent />
            <div className="grid grid-row-3 grid-cols-[1fr_1fr_0.1fr] grid-flow-row-dense gap-4 pl-32 pr-10 pb-14 pt-2">
                <div className="bg-zinc-800 p-4 rounded-md">01</div>
                <div className="bg-zinc-800 p-4 rounded-md">02</div>
                <div className="bg-zinc-800 p-4 col-span-2 row-span-2 rounded-md">03</div>
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
