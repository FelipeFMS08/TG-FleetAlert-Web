import { Input } from "@/components/ui/input";
import { RouteResponse } from "@/dto/responses/routes.response";
import { Table } from "@tanstack/react-table";
import { useState } from "react";
import { RouteCreateModal } from "./routes-create.component";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { UsersResponse } from "@/dto/responses/users.response";
import VehicleResponse from "@/dto/responses/vehicle.response";


interface DataTableToolbarProps {
    table: Table<RouteResponse>;
    setRoutes: React.Dispatch<React.SetStateAction<any>>;
    data: RouteResponse[];
    vehicles: VehicleResponse[];
    executors: UsersResponse[];
}

export function DataTableToolbar(props: DataTableToolbarProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [showCreateButton, setShowCreateButton] = useState(false);
    const isFiltered = props.table.getState().columnFilters.length > 0;

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filterValue = event.target.value.toLowerCase();
        props.table.getColumn("name")?.setFilterValue(filterValue);

        const filteredData = props.data.filter((route) =>
            route.name.toLowerCase().includes(filterValue)
        );
        
        setShowCreateButton(filteredData.length === 0 && filterValue !== "");
        setNewUserEmail(filterValue); 
    };

    return (
        <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar Rotas..."
          value={(props.table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            props.table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => props.table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Resetar
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <RouteCreateModal executors={props.executors} vehicles={props.vehicles} setRoutes={props.setRoutes} data={props.data}/>
    </div>
    )
}