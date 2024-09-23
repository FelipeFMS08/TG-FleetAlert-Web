"use client";

import { NavBarComponent } from "@/components/shared/navbar/navbar-component";
import { ModeToggle } from "@/components/shared/toggle";
import FleetMap from "@/components/tracking/fleet-map.component";
import { useState } from "react";
import { Circle, MapContainer, TileLayer } from "react-leaflet";

export default function TrackingPage() {

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      <NavBarComponent />
      <div className="w-screen mt-2 flex flex-col ml-32">
        <MapContainer
          style={{ height: "90%", width: "500px" }}
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

      <div className="absolute bottom-3 right-3">
        <ModeToggle />
      </div>
    </div>
  );
}
