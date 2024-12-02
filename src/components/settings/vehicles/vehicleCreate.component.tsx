import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react"
import VehicleCommand from "@/dto/commands/vehicle.command"
import { createVehicle } from "@/services/vehicle.service"
import VehicleResponse from "@/dto/responses/vehicle.response"
import { UsersResponse } from "@/dto/responses/users.response"

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório."),
    placaVeiculo: z.string().min(1, "Placa é obrigatória."),
    responsible: z.string().nonempty("Responsável é obrigatório."),
    type: z.string().nonempty("Tipo de veículo é obrigatório."),
});

interface CreateModalProps {
    setVehicles: React.Dispatch<React.SetStateAction<any>>;
    data: VehicleResponse[];
    users: UsersResponse[];
}

export function VehicleCreateModal(props: CreateModalProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const hasResponsible = props.users.length > 0;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            placaVeiculo: "",
            responsible: "",
            type: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!hasResponsible) {
            alert("Não há responsáveis disponíveis para selecionar.");
            return;
        }
        setLoading(true);

        const vehicleCommand: VehicleCommand = {
            name: values.name,
            signSerial: values.placaVeiculo,
            responsibleId: values.responsible,
            type: values.type
        }

        try {
            const response = await createVehicle(vehicleCommand);
            props.setVehicles((previous: any) => ({ ...previous, vehicles: [...props.data, response] }));
            setOpen(false);
            setLoading(false);
            window.location.reload();


        } catch (error) {
            console.error('Erro ao criar veículo:', error);
            alert('Falha ao criar o veículo. Por favor, tente novamente.');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Adicionar Veículo</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-zinc-900">
                <DialogHeader>
                    <DialogTitle>Adicionar Veículo</DialogTitle>
                    <DialogDescription>
                        Adicione veículos que possam ser utilizados em rotas.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-3">
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" placeholder="Scania" {...form.register("name")} />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="placaVeiculo">Placa do Veículo</Label>
                        <Input id="placaVeiculo" placeholder="X213FD" {...form.register("placaVeiculo")} />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="responsible">Responsável pelo Veículo</Label>
                        <Select onValueChange={(value) => form.setValue("responsible", value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o Responsável" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-zinc-900">
                                <SelectGroup>
                                    <SelectLabel>Responsáveis</SelectLabel>
                                    {hasResponsible ? (
                                        props.users.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem disabled value="">
                                            Nenhum responsável disponível
                                        </SelectItem>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="type">Tipo de Veículo</Label>
                        <Select onValueChange={(value) => form.setValue("type", value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o Tipo" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-zinc-900">
                                <SelectGroup>
                                    <SelectLabel>Tipo</SelectLabel>
                                    <SelectItem value="TRUCK">Caminhão</SelectItem>
                                    <SelectItem value="VAN">Van</SelectItem>
                                    <SelectItem value="CAR">Carro</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={!hasResponsible}>
                            {loading ? (
                                <div className="flex justify-center items-center">
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <circle cx="12" cy="12" r="10" strokeWidth="4" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 12a8 8 0 018-8m0 0a8 8 0 018 8m-8-8v8h8"
                                        />
                                    </svg>
                                    Carregando...
                                </div>
                            ) : (
                                "Adicionar Veículo"
                            )
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
