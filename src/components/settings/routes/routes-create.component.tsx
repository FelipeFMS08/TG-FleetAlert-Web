import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { FeatureGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";
import { useTheme } from "next-themes";
import SetupRouting from "@/components/shared/setup-routing.component";
import VehicleResponse from "@/dto/responses/vehicle.response";
import { UsersResponse } from "@/dto/responses/users.response";
import { RouteCommand } from "@/dto/commands/route.command";
import { getSession, useSession } from "next-auth/react";
import { RouteResponse } from "@/dto/responses/routes.response";
import { createRoute, getAllRoutes } from "@/services/routes.service";

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
    iconSize: [25, 25],
    iconAnchor: [12.5, 25],
    shadowSize: [41, 41],
});

interface CreateRouteModalProps {
    vehicles: VehicleResponse[];
    executors: UsersResponse[];
    setRoutes: React.Dispatch<React.SetStateAction<any>>;
    data: RouteResponse[];
}

export function RouteCreateModal(props: CreateRouteModalProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [startCoordinates, setStartCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [endCoordinates, setEndCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [geofencingData, setGeofencingData] = useState<string | null>(null);
    const [drawingEnabled, setDrawingEnabled] = useState(true);
    const [loading, setLoading] = useState(false);  // Estado de loading
    const { data: session } = useSession();

    const { theme } = useTheme();

    const form = useForm({
        defaultValues: {
            name: "",
            executor: "",
            startAddress: "",
            endAddress: "",
            vehicle: "",
        },
        mode: "onBlur",
    });

    function extractCoordinatesFromUrl(url: string) {
        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = url.match(regex);
        if (match) {
            return {
                lat: parseFloat(match[1]),
                lng: parseFloat(match[2]),
            };
        }
        return null;
    }

    function goToNextStep() {
        const startAddress = form.getValues("startAddress");
        const endAddress = form.getValues("endAddress");

        if (startAddress) {
            const startCoords = extractCoordinatesFromUrl(startAddress);
            if (startCoords) setStartCoordinates(startCoords);
        }
        if (endAddress) {
            const endCoords = extractCoordinatesFromUrl(endAddress);
            if (endCoords) setEndCoordinates(endCoords);
        }

        setStep(2);
    }

    function goToPreviousStep() {
        setStep(1);
    }

    async function onSubmit(data: any) {
        if (!geofencingData) {
            alert("O geofencing é obrigatório. Desenhe a área no mapa.");
            return;
        }

        setLoading(true);

        const routeRequest: RouteCommand = {
            name: data.name,
            creatorid: session?.user?.id!,
            finishAddress: `{${endCoordinates?.lat + ',' + endCoordinates?.lng}}`,
            startAddress: `{${startCoordinates?.lat + ',' + startCoordinates?.lng}}`,
            geofencinginfos: geofencingData!,
            status: "WAITING",
            userId: data.executor,
            vehicleId: parseInt(data.vehicle),
        };

        await createRoute(routeRequest);

        setLoading(false);
        setOpen(false);
        window.location.reload();

    }

    function handleDrawCreated(e: any) {
        const layer = e.layer;
        const latlngs = layer.getLatLngs()[0].map((latlng: L.LatLng) => ({
            lat: latlng.lat,
            lng: latlng.lng,
        }));
        setGeofencingData(JSON.stringify(latlngs));
        setDrawingEnabled(false);
    }

    function handleDrawDeleted() {
        setGeofencingData(null);
        setDrawingEnabled(true);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Criar Rota</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-zinc-900">
                <DialogHeader>
                    <DialogTitle>Criar Nova Rota</DialogTitle>
                    <DialogDescription>
                        {step === 1 ? "Preencha as informações da rota." : "Defina o geofencing da rota no mapa."}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <form onSubmit={form.handleSubmit(goToNextStep)} className="grid gap-6 py-3">
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="name">Nome da Rota</Label>
                            <Input
                                id="name"
                                placeholder="Nome da rota"
                                {...form.register("name", { required: "Nome da rota é obrigatório" })}
                            />
                            {form.formState.errors.name && <span>{form.formState.errors.name.message}</span>}
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="executor">Executor</Label>
                            <Select
                                onValueChange={(value) => form.setValue("executor", value)}
                                {...form.register("executor", { required: "Executor é obrigatório" })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o Executor" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-zinc-900">
                                    <SelectGroup>
                                        <SelectLabel>Executores</SelectLabel>
                                        {props.executors.map((executor) => (
                                            <SelectItem key={executor.id} value={executor.id}>
                                                {executor.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.executor && <span>{form.formState.errors.executor.message}</span>}
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="startAddress">Endereço de Partida</Label>
                            <Input
                                id="startAddress"
                                placeholder="Endereço inicial"
                                {...form.register("startAddress", { required: "Endereço de partida é obrigatório" })}
                            />
                            {form.formState.errors.startAddress && <span>{form.formState.errors.startAddress.message}</span>}
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="endAddress">Endereço de Destino</Label>
                            <Input
                                id="endAddress"
                                placeholder="Endereço final"
                                {...form.register("endAddress", { required: "Endereço de destino é obrigatório" })}
                            />
                            {form.formState.errors.endAddress && <span>{form.formState.errors.endAddress.message}</span>}
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="vehicle">Veículo</Label>
                            <Select
                                onValueChange={(value) => form.setValue("vehicle", value)}
                                {...form.register("vehicle", { required: "Veículo é obrigatório" })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o Veículo" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-zinc-900">
                                    <SelectGroup>
                                        <SelectLabel>Veículos</SelectLabel>
                                        {props.vehicles.map((vehicle) => (
                                            <SelectItem key={vehicle.id} value={vehicle.id}>
                                                {vehicle.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.vehicle && <span>{form.formState.errors.vehicle.message}</span>}
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                Próxima Etapa
                            </Button>
                        </DialogFooter>
                    </form>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <MapContainer
                            className="rounded-md"
                            style={{ height: "500px", width: "100%" }}
                            center={startCoordinates!}
                            zoom={13}
                        >
                            <TileLayer
                                url={
                                    theme === "light"
                                        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                                        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                                }
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />
                            {startCoordinates && <Marker position={startCoordinates} />}
                            {endCoordinates && <Marker position={endCoordinates} />}
                            {startCoordinates && endCoordinates && (
                                <SetupRouting
                                    startPoint={startCoordinates}
                                    endPoint={endCoordinates}
                                />
                            )}
                            <FeatureGroup>
                                <EditControl
                                    position="topright"
                                    onCreated={handleDrawCreated}
                                    onDeleted={handleDrawDeleted}
                                    draw={{
                                        rectangle: drawingEnabled,
                                        polyline: false,
                                        polygon: drawingEnabled,
                                        circle: false,
                                        marker: false,
                                        circlemarker: false,
                                    }}
                                />
                            </FeatureGroup>
                        </MapContainer>
                        <DialogFooter>
                            <Button onClick={goToPreviousStep} type="button" variant="secondary">
                                Anterior
                            </Button>
                            <Button onClick={form.handleSubmit(onSubmit)} type="button" disabled={loading}>
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
                                        Criando...
                                    </div>
                                ) : (
                                    "Criar Rota"
                                )
                                }
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
