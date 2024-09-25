import { AlertTriangleIcon, Info, LoaderPinwheel, Locate, LocateFixed } from "lucide-react";


export function UserInfoTrack() {
    return (
        <div className="bg-zinc-800 p-4 rounded-md flex flex-col justify-between h-72">
            <div>
                <h1 className="text-2xl font-bold">Rafael Oliveira</h1>
                <h4 className="text-zinc-600">Raf123el  •  Volvo FMX</h4>
            </div>

                <h4 className="text-zinc-400"><span className="text-white font-bold">Endereço:</span> Av. Ten. Marques, 5136 - Chácara do Solar I (Fazendinha), Santana de Parnaíba - SP, 06530-001</h4>
            {getStatusTrack("FINISHED")}
        </div>
    )
}


function getStatusTrack(status: string) {
    switch (status) {
        case "STARTED":
            return <div className="bg-blue-500 text-white flex gap-2 rounded-md py-3 px-4 uppercase font-light"><Locate /> Em monitoramento</div>
        case "FINISHED":
            return <div className="bg-green-500 text-white flex gap-2 rounded-md py-3 px-4 uppercase font-light"><LocateFixed /> Rota finalizada</div>
        case "WAITING":
            return <div className="bg-zinc-700 text-white flex gap-2 rounded-md py-3 px-4 uppercase font-light"><LoaderPinwheel /> Aguardando inicio de rota</div>
        default:
            return <div className="bg-red-300 text-white flex gap-2 rounded-md py-3 px-4 uppercase font-light"><Info /> Sem informações para essa rota</div>

    }
}