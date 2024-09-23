import { useEffect, useRef, useState } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const FleetMap = () => {
    const mapRef = useRef<L.Map | null>(null);
    const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (mapRef.current) return;

            const DefaultIcon = L.icon({
                iconUrl: '/leaflet/marker-icon.png',
                shadowUrl: '/leaflet/marker-shadow.png',
                iconSize: [25, 25],
                iconAnchor: [12.5, 25],
                shadowSize: [41, 41],
            });
            L.Marker.prototype.options.icon = DefaultIcon;

            const map = L.map('map').setView([-23.561682, -46.655898], 13);
            mapRef.current = map;

            // Troca a camada para uma versão escura
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(map);

            const startPoint: [number, number] = [-23.4422149,-46.9243186]; // Rua Paulista
            const endPoint: [number, number] = [-23.4065828,-46.8806725]; // Rua Augusta

            L.marker(endPoint).addTo(map);
            L.marker(startPoint).addTo(map);

            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(startPoint[0], startPoint[1]),
                    L.latLng(endPoint[0], endPoint[1]),
                ],
                 lineOptions: {
                     styles: [{ color: '#ef4444', opacity: 0.7, weight: 5 }], // Cor da rota
                     extendToWaypoints: true,
                     missingRouteTolerance: 10
                 }
            }).addTo(map);

            

            routingControl.on('routesfound', (e) => {
                const routes = e.routes;
                const route = routes[0];

                setEstimatedTime(route.summary.totalTime);

                const latitudes = route.coordinates.map((coord: any) => coord.lat);
                const longitudes = route.coordinates.map((coord: any) => coord.lng);

                const center = [
                    (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
                    (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
                ] as L.LatLngExpression;

                const radius = Math.max(
                    ...route.coordinates.map((coord: any) => map.distance(center, [coord.lat, coord.lng]))
                );

                L.circle(center as L.LatLngExpression, { radius, color: 'gray', fillOpacity: 0.2 }).addTo(map);

                const bounds = L.latLngBounds([startPoint, endPoint]);
                map.fitBounds(bounds);
            });
        }
    }, []);

    return (
        <>
            <div id="map" style={{ height: "100%", width: "100%" }} />
            {estimatedTime &&  console.log("Tempo estimado para o rafa chegar na dama:" + Math.round(estimatedTime! / 60), "minutos")}
        </>
    );
};

export default FleetMap;
