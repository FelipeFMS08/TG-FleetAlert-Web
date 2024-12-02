import { useEffect, useState } from "react";
import { RouteResponse } from "@/dto/responses/routes.response";
import { AlertTriangleIcon, Info, LoaderPinwheel, Locate, LocateFixed } from "lucide-react";

interface UserInfoTrackProps {
    data: RouteResponse;
}

export function UserInfoTrack(props: UserInfoTrackProps) {
    const [address, setAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { vehicle, user, status, startAddress, finishAddress } = props.data;

    useEffect(() => {
        const fetchAddress = async (latitude: number, longitude: number) => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );
                const data = await response.json();
                
                const { address } = data;
                const formattedAddress = `${address.road || ''}, ${address.suburb || address.neighbourhood || ''}, ${address.city || address.town || address.village}, ${address.state}, ${address.country}`;
                setAddress(formattedAddress.trim()); 
            } catch (error) {
                console.error("Erro ao buscar endereço:", error);
                setAddress("Endereço não encontrado");
            } finally {
                setLoading(false);
            }
        };
    
        if (startAddress && finishAddress) {
            const [endLat, endLng] = props.data.finishAddress
                .replace(/[{}]/g, "")
                .split(",")
                .map(Number);
            const endCoordinates = { lat: endLat, lng: endLng }; 
            fetchAddress(endCoordinates.lat, endCoordinates.lng); 
        }
    }, [startAddress, finishAddress]);
    

    return (
        <div className="dark:bg-zinc-800 p-4 rounded-md flex flex-col justify-between h-72 bg-zinc-100">
            <div>
                <h1 className="text-2xl font-bold">{user}</h1>
                <h4 className="dark:text-zinc-600 text-zinc-700">{vehicle.signSerial} • {vehicle.name}</h4>
            </div>

            <h4 className="dark:text-zinc-400 text-zinc-700">
                <span className="dark:text-white font-bold">Endereço Final (Aproximado): </span>
                {loading ? "Carregando endereço..." : address || "Endereço não disponível"}
            </h4>

            {getStatusTrack(props.data.status)}
        </div>
    );
}

export function getStatusTrack(status: string) {
    switch (status) {
        case "STARTED":
            return <div className="bg-blue-500 text-white flex gap-2 rounded-md py-3 px-4 uppercase font-light"><Locate /> Em monitoramento</div>;
        case "FINISHED":
            return <div className="bg-green-500 text-white flex gap-2 rounded-md py-3 px-4 uppercase font-light"><LocateFixed /> Rota finalizada</div>;
        case "WAITING":
            return <div className="bg-zinc-700 text-white flex gap-2 rounded-md py-3 px-4 uppercase font-light"><LoaderPinwheel /> Aguardando inicio de rota</div>;
        default:
            return <div className="bg-red-300 text-white flex gap-2 rounded-md py-3 px-4 uppercase font-light"><Info /> Sem informações para essa rota</div>;
    }
}
