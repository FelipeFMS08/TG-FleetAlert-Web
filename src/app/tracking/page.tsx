"use client";

import { NavBarComponent } from "@/components/shared/navbar/navbar-component";
import { ModeToggle } from "@/components/shared/toggle";

export default function TrackingPage() {

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      <NavBarComponent />
      <div className="w-screen mt-2 flex flex-col ml-32">
        teste

        <div className="absolute bottom-3 right-3">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
