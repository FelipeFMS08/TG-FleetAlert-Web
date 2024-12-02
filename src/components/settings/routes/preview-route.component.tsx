import SetupRouting from "@/components/shared/setup-routing.component";
import { RouteResponse } from "@/dto/responses/routes.response";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TileLayer, Marker, Polygon } from "react-leaflet";
import { useTheme } from "next-themes";
import { MapContainer } from "react-leaflet";
import { Button } from "@/components/ui/button";

interface PreviewRouteProps {
  route: RouteResponse;
  open: boolean;
  onClose: () => void;
}

export function PreviewRoute({ route, open, onClose }: PreviewRouteProps) {
  const { theme } = useTheme();

  const [startLat, startLng] = route.startAddress
    .replace(/[{}]/g, "")
    .split(",")
    .map(Number);

  const [endLat, endLng] = route.finishAddress
    .replace(/[{}]/g, "")
    .split(",")
    .map(Number);

  const startCoordinates = { lat: startLat, lng: startLng };
  const endCoordinates = { lat: endLat, lng: endLng };

  const geofencingCoordinates = JSON.parse(route.geofencinginfos).map(
    (point: { lat: number; lng: number }) => [point.lat, point.lng]
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle>Rota: {route.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <MapContainer
            className="rounded-md"
            style={{ height: "500px", width: "100%" }}
            center={startCoordinates}
            zoom={13}
          >
            <TileLayer
              url={
                theme === "light"
                  ? `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
                  : `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
              }
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <Marker position={startCoordinates} />
            <Marker position={endCoordinates} />
            <Polygon positions={geofencingCoordinates} />
            <SetupRouting
              startPoint={startCoordinates}
              endPoint={endCoordinates}
            />
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
