"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleCreateModal } from "./vehicleCreate.component";
import VehicleResponse from "@/dto/responses/vehicle.response";
import { set } from "react-hook-form";


interface DataTableToolbarProps {
  table: Table<VehicleResponse>;
  setVehicles: React.Dispatch<React.SetStateAction<VehicleResponse[]>>;
  data: VehicleResponse[];
}

export function DataTableToolbar({
  table,
  setVehicles,
  data
}: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar Veiculos..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Resetar
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <VehicleCreateModal data={data} setVehicles={setVehicles} />
    </div>
  );
}