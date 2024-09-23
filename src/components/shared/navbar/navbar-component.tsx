import { HomeIcon, CompassIcon, BookmarkIcon, SettingsIcon, DoorOpenIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MenuItem } from "./item-menu-component";
import { signOut } from "next-auth/react";


export function NavBarComponent() {
    return (
        <div className="fixed left-2 top-2 h-screen w-20 ">
            <div className="p-4 bg-zinc-300 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded-md">
                <Link href="#" className="flex items-center" prefetch={false}>
                    <Image
                        src="/logo2.svg"
                        alt="Vercel Logo"
                        className="dark:text-white mx-auto"
                        width={64}
                        height={64}
                        priority
                    />
                </Link>
            </div>
            <nav className="flex flex-col justify-between mt-3 space-y-1 px-4 bg-zinc-300 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded-md py-5 h-[80%]">
                <div className="gap-3">
                    <MenuItem to="/" icon={<HomeIcon className="h-7 w-7" />} />
                    <MenuItem to="/tracking" icon={<CompassIcon className=" h-7 w-7" />} />
                    <MenuItem to="/reports" icon={<BookmarkIcon className=" h-7 w-7" />} />
                    <MenuItem to="/settings" icon={<SettingsIcon className=" h-7 w-7" />} />
                </div>
                <MenuItem to="/" onClick={() => signOut()} icon={<DoorOpenIcon className=" h-7 w-7 text-red-500 hover:text-white" />} />
            </nav>
        </div>
    )
}