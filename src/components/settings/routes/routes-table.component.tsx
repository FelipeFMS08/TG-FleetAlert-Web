"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { DataTablePagination } from "@/components/shared/table/DataTablePagination.component";
import { RouteResponse } from "@/dto/responses/routes.response";
import { DataTableToolbar } from "./routes-toolbar-table.component";
import VehicleResponse from "@/dto/responses/vehicle.response";
import { UsersResponse } from "@/dto/responses/users.response";
import { PreviewRoute } from "./preview-route.component";

interface DataTableProps {
    columns: (openModal: (route: RouteResponse) => void) => ColumnDef<RouteResponse, string>[];
    data: RouteResponse[];
    vehicles: VehicleResponse[];
    executors: UsersResponse[];
    setRoutes: React.Dispatch<React.SetStateAction<any>>;
}

export function RoutesTable({
    columns,
    data,
    vehicles,
    executors,
    setRoutes
}: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedRoute, setSelectedRoute] = useState<RouteResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (route: RouteResponse) => {
        setSelectedRoute(route);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedRoute(null);
        setIsModalOpen(false);
    };

    const table = useReactTable({
        data,
        columns: columns(openModal),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        }
    });

    return (
        <div className="w-full p-4 shadow rounded-lg mb-5">
            <div className="flex justify-between min-w-full max-w-screen-xl py-3 items-center p-5 bg-zinc-100 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded-md mb-5">
                <h1>Tabela de Rotas</h1>
            </div>
            <DataTableToolbar table={table} setRoutes={setRoutes} data={data} vehicles={vehicles} executors={executors} />
            <Table className="mb-5">
                <TableHeader className="mb-5">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <DataTablePagination table={table} />
            {selectedRoute && (
                <PreviewRoute
                    route={selectedRoute}
                    open={isModalOpen}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}
