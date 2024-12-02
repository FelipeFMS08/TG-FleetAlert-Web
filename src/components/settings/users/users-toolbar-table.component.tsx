"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { UsersResponse } from "@/dto/responses/users.response";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { registerUser } from "@/services/settings.service";

interface DataTableToolbarProps {
    table: Table<UsersResponse>;
    setUsers: React.Dispatch<React.SetStateAction<any>>;
    data: UsersResponse[];
}

export function DataTableToolbar({
    table,
    setUsers,
    data,
}: DataTableToolbarProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [showCreateButton, setShowCreateButton] = useState(false);
    const isFiltered = table.getState().columnFilters.length > 0;

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filterValue = event.target.value.toLowerCase();
        table.getColumn("email")?.setFilterValue(filterValue);

        const filteredData = data.filter((user) =>
            user.email.toLowerCase().includes(filterValue)
        );
        
        setShowCreateButton(filteredData.length === 0 && filterValue !== "");
        setNewUserEmail(filterValue); 
    };


    const handleRegister = async () => {
        const newUser = await registerUser(newUserEmail);
        console.log(newUser);
    }
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filtrar por email..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={handleFilterChange}
                    className="h-8 w-full"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            table.resetColumnFilters();
                            setShowCreateButton(false); 
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Resetar
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}

                {showCreateButton && (
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-8 px-4"
                    >
                        Cadastrar Novo Usuário
                    </Button>
                )}
            </div>

            {/* Modal */}
            <AlertDialog open={isCreateModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cadastrar novo usuário</AlertDialogTitle>
                        <AlertDialogDescription>
                            O usuário com o email <strong>{newUserEmail}</strong> não foi encontrado. Deseja cadastrá-lo?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsCreateModalOpen(false)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                console.log(`Cadastrando o usuário: ${newUserEmail}`);
                                handleRegister();
                                setIsCreateModalOpen(false); 
                            }}
                        >
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
