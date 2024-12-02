import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polygon, useMap, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import { useTheme } from "next-themes";
import { AlertResponse, RouteResponse } from "@/dto/responses/routes.response";
import DriftMarker from "react-leaflet-drift-marker";
import { useWebSocket } from "@/app/WebSocketProvider";

interface FleetMapProps {
    data: RouteResponse;
    highlightedAlert: number | null;
}

const createCustomIcon = (imageUrl: string) => {
    return new L.Icon({
        iconUrl: imageUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};


const FleetMap = (props: FleetMapProps) => {
    const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const [currentPosition, setCurrentPosition] = useState<{ latitude: number | 0; longitude: number | 0; } | null>(null);
    const [allAlerts, setAllAlerts] = useState<any[]>([]);
    const routeRef = useRef<{ latitude: number | 0; longitude: number | 0; }[]>([]);
    const { alerts: wsAlerts, userLocations, socket } = useWebSocket();

    const { theme } = useTheme();

    const [startLat, startLng] = props.data.startAddress
        .replace(/[{}]/g, "")
        .split(",")
        .map(Number);

    const [endLat, endLng] = props.data.finishAddress
        .replace(/[{}]/g, "")
        .split(",")
        .map(Number);

    const startCoordinates = L.latLng(startLat, startLng);
    const endCoordinates = L.latLng(endLat, endLng);

    const geofencingCoordinates: [number, number][] = JSON.parse(props.data.geofencinginfos).map(
        (point: { lat: number; lng: number }) => [point.lat, point.lng]
    );

    useEffect(() => {
        if (props.data.alerts) {
            const processedAlerts = props.data.alerts.map((alert) => {
                // Transformar a string JSON em objeto
                const { latitude, longitude } = JSON.parse(alert.location);
    
                return {
                    ...alert,
                    location: L.latLng(latitude, longitude),
                };
            });
    
            setAllAlerts(processedAlerts);
        }
    }, [props.data.alerts]);
    

    useEffect(() => {
        if (wsAlerts.length > 0) {
            const newAlerts = wsAlerts.map((alert) => {
                const { latitude, longitude } = alert.location; 
                return {
                    ...alert,
                    location: L.latLng(latitude, longitude), 
                };
            });
    
            setAllAlerts((prevAlerts) => [...prevAlerts, ...newAlerts]);
        }
    }, [wsAlerts])



    const SetupRouting = () => {
        const map = useMap();
        useEffect(() => {
            if (!mapRef.current) {
                mapRef.current = map;

                const DefaultIcon = L.icon({
                    iconUrl: '/leaflet/marker-icon.png',
                    shadowUrl: '/leaflet/marker-shadow.png',
                    iconSize: [25, 25],
                    iconAnchor: [12.5, 25],
                    shadowSize: [41, 41],
                });
                L.Marker.prototype.options.icon = DefaultIcon;

                L.marker(startCoordinates).addTo(map);
                L.marker(endCoordinates).addTo(map);

                L.tileLayer(
                    theme === 'light'
                        ? `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
                        : `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`,
                    {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    }
                ).addTo(map);

                const routingControl = L.Routing.control({
                    waypoints: [startCoordinates, endCoordinates],
                    lineOptions: {
                        styles: [{ color: '#ef4444', opacity: 0.7, weight: 5 }],
                        extendToWaypoints: true,
                        missingRouteTolerance: 10
                    },
                    show: false,
                    addWaypoints: false,
                }).addTo(map);

                routingControl.on('routesfound', (e) => {
                    const route = e.routes[0];
                    setEstimatedTime(route.summary.totalTime);

                    const bounds = L.latLngBounds([startCoordinates, endCoordinates]);
                    map.fitBounds(bounds);
                });
            }
        }, [map, theme]);

        return null;
    };

    useEffect(() => {
        if (userLocations.length > 0) {
            const lastLocation = userLocations.findLast(location => location);
            const newPosition = {
                latitude: lastLocation!.location.latitude,
                longitude: lastLocation!.location.longitude,
            };

            setCurrentPosition(newPosition);
            routeRef.current = [...routeRef.current, newPosition];
        }


    }, [userLocations]);

    useEffect(() => {
        if (props.highlightedAlert) {
            console.log(`Destacando a área do alerta com ID: ${props.highlightedAlert}`);
        } else {
            console.log("Removendo destaque do mapa.");
        }
    }, [props.highlightedAlert]);

    return (
        <MapContainer
            className="rounded-md md:min-w-[500px] max-w-[350px]"
            style={{ height: "100%", width: "500px" }}
            center={[startLat, startLng]}
            zoom={20}
        >
            <TileLayer
                url={
                    theme === 'light'
                        ? `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
                        : `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
                }
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <Marker position={startCoordinates} />
            {allAlerts?.map((alert) => (
                <>
                    {props.highlightedAlert === alert.id && (
                        <Circle
                            center={alert.location}
                            radius={50}
                            color="red"
                        />
                    )}
                    <Marker
                        key={alert.id}
                        position={alert.location}
                        icon={createCustomIcon("/leaflet/markers/alert-flag.png")}
                    />
                </>
            ))}
            {currentPosition && (
                <DriftMarker
                    position={[currentPosition.latitude, currentPosition.longitude]}
                    duration={1000}
                    icon={createCustomIcon("/leaflet/markers/vehicle-marker.png")}
                >
                    <div
                        style={{
                            backgroundColor: "blue",
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            border: "2px solid white",
                        }}
                    />
                </DriftMarker>
            )}
            <Marker position={endCoordinates} />
            <Polygon positions={geofencingCoordinates} color="gray" fillOpacity={0.3} />
            <SetupRouting />
        </MapContainer>
    );
};

export default FleetMap;
