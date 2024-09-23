import React, { ReactNode } from "react";
import Link from "next/link";

interface MenuItemProps {
    to: string;
    icon: ReactNode;
    active?: boolean;
    onClick?: () => void;
}

export function MenuItem(props: MenuItemProps) {
    return (
        <Link
            href={props.to}
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-primary dark:hover:text-white hover:text-white"
            prefetch={false}
        >
            {props.icon}
        </Link>
    )
}