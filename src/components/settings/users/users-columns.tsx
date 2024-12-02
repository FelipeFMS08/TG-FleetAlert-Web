"use client";

import { DataTableColumnHeader } from "@/components/shared/table/DataTableColumnHeader.component";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UsersResponse } from "@/dto/responses/users.response";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";


export const usersColumns: ColumnDef<UsersResponse>[] = [
    {
        accessorKey: "photo",
        header: "",
        cell: ({ row }) => {
            return <Image
                width={48}
                height={48}
                src={row.getValue("photo")}
                alt="photo"
                className="rounded-full w-12 h-12 object-cover"
            />
        }
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Nome" />
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Email" />
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Grupo" />
        },
        cell: ({ row }) => {
            switch (row.getValue("role")) {
                case "MEMBER":
                    return <Badge variant="outline" className="py-1 flex items-center justify-center w-28">USUÁRIO</Badge>
                case "ADMIN":
                    return <Badge variant="destructive" className="py-1 flex items-center justify-center w-28">ADMIN</Badge>
                case "MANAGEMENT":
                    return <Badge variant="secondary" className="py-1 flex items-center justify-center w-28">GESTOR</Badge>
                default:
                    return ""
            }
        }
    },
    {
        accessorKey: "emailVerified",
        header: "Status Email",
        cell: ({ row }) => {
            return row.getValue("emailVerified") ?
                <Badge className="bg-green-500 py-1 flex items-center justify-center w-32 hover:bg-green-600">VERIFICADO</Badge>
                :
                <Badge className="bg-red-500 flex items-center justify-center w-32 py-1">NÃO VERIFICADO</Badge>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-800">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(user.id)}
                            className="focus:bg-zinc-700 bg-zinc-800 cursor-pointer"
                        >
                            Resetar senha
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

