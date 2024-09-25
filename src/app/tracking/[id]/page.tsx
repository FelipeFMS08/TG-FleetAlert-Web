"use client";

import { NavBarComponent } from "@/components/shared/navbar/navbar-component";
import { ModeToggle } from "@/components/shared/toggle";
import { DriverScoreTrack } from "@/components/tracking/tracking-components/driver-score-track.component";
import { UserInfoTrack } from "@/components/tracking/tracking-components/user-info-track.component";

import dynamic from 'next/dynamic'
 
const FleetMap = dynamic(() => import('@/components/tracking/fleet-map.component'), {
  ssr: false,
})

export default function TrackingPage({ params }: { params: { slug: string } }) {

    return (
        <div className="flex h-screen bg-white dark:bg-zinc-900">
            <NavBarComponent />
            <div className="grid grid-cols-[1fr_1fr_0.1fr] grid-row-3 grid-flow-row-dense gap-4 pl-32 pr-10 pb-14 pt-2">
                <UserInfoTrack />
                <DriverScoreTrack />
                <div className="bg-zinc-800 p-4 col-span-2 row-span-2 rounded-md h-[25rem]">Em codificação</div>
                <div className="grid grid-cols-subgrid gap-4 row-span-3 rounded-md">
                    <FleetMap />
                </div>
            </div>


            <div className="absolute bottom-3 right-3">
                <ModeToggle />
            </div>
        </div>
    );
}
