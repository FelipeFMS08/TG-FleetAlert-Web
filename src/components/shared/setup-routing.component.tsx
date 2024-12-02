import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface SetupRoutingProps {
    startPoint: { lat: number; lng: number };
    endPoint: { lat: number; lng: number };
}

const SetupRouting = ({ startPoint, endPoint }: SetupRoutingProps) => {
    const map = useMap(); 
    const routingControlRef = useRef<L.Routing.Control | null>(null); 

    useEffect(() => {
        if (!routingControlRef.current) return;

        if (routingControlRef.current) {
            routingControlRef.current.remove();
        }

        routingControlRef.current = L.Routing.control({
            waypoints: [
                L.latLng(startPoint.lat, startPoint.lng),
                L.latLng(endPoint.lat, endPoint.lng),
            ],
            lineOptions: {
                styles: [{ color: '#ef4444', opacity: 0.7, weight: 5 }],
                extendToWaypoints: true,
                missingRouteTolerance: 10
            },
            show: false, 
            addWaypoints: false, 
        }).addTo(map);

        const bounds = L.latLngBounds([startPoint, endPoint]);
        map.fitBounds(bounds);


        return () => {
            if (routingControlRef.current) {
                routingControlRef.current.remove();
                routingControlRef.current = null;
            }
        };
    }, [map, startPoint, endPoint]);

    return null;
};

export default SetupRouting;
