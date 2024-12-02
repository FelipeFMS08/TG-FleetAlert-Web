import { ReportsResponse } from "@/dto/responses/reports.response";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import DownloadButton from "./download-button";
import { getStatusTrack } from "../tracking/tracking-components/user-info-track.component";
import { DataTableColumnHeader } from "../shared/table/DataTableColumnHeader.component";
import { Badge } from "../ui/badge";

export const reportsColumns: ColumnDef<ReportsResponse>[] = [
    {
        accessorKey: "name",
        header: "Nome da Rota",
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[200px] truncate font-medium">
                    {row.original.route.name}
                </span>
            </div>
        )
    },
    {
        accessorKey: "user",
        header: "Usuário",
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[150px] truncate font-medium">
                    {row.original.route.user}
                </span>
            </div>
        )
    },
    {
        accessorKey: "creator",
        header: "Criador",
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[150px] truncate font-medium">
                    {row.original.route.creator}
                </span>
            </div>
        )
    },
    {
        accessorKey: "vehicle.name",
        header: "Veículo",
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[150px] truncate font-medium">
                    {row.original.vehicle.name}
                </span>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Status" />
        },
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium">
                    {getStatusTrackBadge(row.original.route.status)}
                </span>
            </div>
        )
    },
    {
        accessorKey: "alerts",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Alertas" />
        },
        cell: ({ row }) => (
            <div className="flex">
                <span className="max-w-[150px] truncate font-medium">
                    {row.original.alerts}
                </span>
            </div>
        )
    },
    {
        accessorKey: "download",
        header: "Baixar Relatório",
        cell: ({ row }) => (
            <DownloadButton data={row.original} />
        ),
    },
];


export function getStatusTrackBadge(status: string) {
    switch (status) {
        case "WAITING":
            return <Badge variant="outline" className="py-1 flex items-center justify-center w-28 bg-zinc-700 hover:bg-zinc-600">Aguardando</Badge>
        case "FINISHED":
            return <Badge variant="destructive" className="py-1 flex items-center justify-center w-28 bg-green-500 hover:bg-green-400">Rota Finalizada</Badge>
        case "STARTED":
            return <Badge variant="secondary" className="py-1 flex items-center justify-center w-28 bg-blue-500 hover:bg-blue-400">Em Monitoramento</Badge>
        default:
            return ""
    }
}
