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
import { VehicleResponse } from "@/dto/responses/vehicle.response"

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório."),
    placaVeiculo: z.string().min(1, "Placa é obrigatória."),
    responsible: z.string().nonempty("Responsável é obrigatório."),
    type: z.string().nonempty("Tipo de veículo é obrigatório."),
});

interface CreateProps<TData> {
    setVehicles: React.Dispatch<React.SetStateAction<VehicleResponse[]>>;
    data: TData[];
}

export function VehicleCreateModal<TData extends any>(props: CreateProps<TData>) {
    const [open, setOpen] = useState<boolean>(false);

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
        const vehicleCommand: VehicleCommand = {
            name: values.name,
            signSerial: values.placaVeiculo,
            idResponsibleid: values.responsible,
            type: values.type
        }

        const response = await createVehicle(vehicleCommand);

        if (response == 201) {
            console.log("FOI");
        }

        props.setVehicles([...props.data, vehicleCommand]);

        setOpen(false);
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
                                    <SelectItem value="f26650d9-9048-4c64-8811-50cb6f7db15d">Felipe</SelectItem>
                                    <SelectItem value="989783e8-68d9-459d-bb8b-1c5ad78abcd7">Rafael</SelectItem>
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
                        <Button type="submit">Adicionar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
