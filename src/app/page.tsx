import { NavBarComponent } from "@/components/shared/navbar/navbar-component";
import { ModeToggle } from "@/components/shared/toggle";

export default function Home() {
  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      <NavBarComponent />

     
      <div className="absolute bottom-3 right-3">
                <ModeToggle />
            </div>
    </div>
  );
}
