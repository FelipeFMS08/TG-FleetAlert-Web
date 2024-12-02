"use client";

import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Alert {
    id: number;
    message: string;
    routeName: string;
    routeId: number;
    location: {latitude: number, longitude: number };
    status: string;
}

interface UserLocation {
    routeId: number;
    location: { latitude: number; longitude: number };
    status: string;
}

interface WebSocketContextProps {
    socket: Socket | null;
    alerts: Alert[];
    userLocations: UserLocation[];
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
}

export function WebSocketProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
    const socketRef = useRef<Socket | null>(null); 

    const { data: session } = useSession()
    useEffect(() => {
        if (session && (session?.user?.role === "ADMIN" || session?.user?.role === "MANAGEMENT") ) {
            if (!socketRef.current) {
                socketRef.current = io('ws://localhost:8080');
                const userId = session?.user?.id;
                if (userId) {
                    socketRef.current.emit('register', { userId, isManager: true});
                }

                socketRef.current.on('alert', (alertData: Alert) => {
                    setAlerts((prevAlertas) => [...prevAlertas, alertData]);
                })


                socketRef.current.on('userLocation', (locationData: UserLocation) => {
                    setUserLocations((prevLocations) => [...prevLocations, locationData]);
                })
            }
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    },[session])
    return (
        <WebSocketContext.Provider value={{ socket: socketRef.current, alerts, userLocations}}>
            {children}
        </WebSocketContext.Provider>
    )
}