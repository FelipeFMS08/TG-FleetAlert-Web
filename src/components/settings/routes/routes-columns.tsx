import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { RouteResponse } from "@/dto/responses/routes.response";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { deleteRouteById } from "@/services/routes.service";
import { toast } from "@/hooks/use-toast";

export const routeColumns = (openModal: (route: RouteResponse) => void): ColumnDef<RouteResponse, string>[] => [
    {
        accessorKey: "name",
        header: "Nome da Rota",
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium">
                    {row.getValue("name")}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "creator",
        header: "Criador",
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium">
                    {row.getValue("creator")}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "route",
        header: "Visualizar Rota",
        cell: ({ row }) => (
            <Button onClick={() => openModal(row.original)}>Ver Rota</Button>
        ),
    },
    {
        accessorKey: "user",
        header: "Responsavel",
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium">
                    {row.getValue("user")}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            switch (row.getValue("status")) {
                case "WAITING":
                    return <Badge variant="outline" className="py-1 flex items-center justify-center w-28 bg-zinc-700">Aguardando</Badge>
                case "FINISHED":
                    return <Badge variant="destructive" className="py-1 flex items-center justify-center w-28 bg-green-500">Rota Finalizada</Badge>
                case "STARTED":
                    return <Badge variant="secondary" className="py-1 flex items-center justify-center w-28 bg-blue-500">Em Monitoramento</Badge>
                default:
                    return ""

            }
        },
    },
    {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
            const route = row.original;
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
                            onClick={async () => {
                                const response = await deleteRouteById(route.id);
                                if (response) {
                                    window.location.reload();                                  
                                }
                            }
                            }
                            className="focus:bg-zinc-700 bg-zinc-800 cursor-pointer"
                        >
                            Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];
