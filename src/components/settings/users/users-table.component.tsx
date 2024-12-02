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
import React from "react";
import { DataTablePagination } from "@/components/shared/table/DataTablePagination.component";
import { DataTableToolbar } from "./users-toolbar-table.component";
import { UsersResponse } from "@/dto/responses/users.response";

interface DataTableProps {
    columns: ColumnDef<UsersResponse, string>[];
    data: UsersResponse[];
}

export function UsersTable({
    columns,
    data,
}: DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        }
    });

    return (
        <div className="w-full p-4 shadow rounded-lg">
            <div className="flex justify-between min-w-full max-w-screen-xl py-3 items-center p-5 bg-zinc-100 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded-md mb-5">
                <h1>Tabela de Usuários</h1>
            </div>
            <DataTableToolbar table={table} setUsers={function (value: any): void {
                throw new Error("Function not implemented.");
            } } data={[]}  />
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}> {header.isPlaceholder ? null : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    </TableHead>
                                )
                            })}
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
        </div>
    )
}