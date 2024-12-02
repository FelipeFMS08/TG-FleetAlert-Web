// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Tipo para a resposta de localização
interface LocationUpdate {
  userId: string;
  location: { lat: number; lng: number };
}

interface Alert {
  message: string;
  userId: string;
  location: { lat: number; lng: number };
}

export const useWebSocket = (userId: string, isManager: boolean) => {
  const [location, setLocation] = useState<LocationUpdate | null>(null);
  const [alert, setAlert] = useState<Alert | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('ws://localhost:8080'); 

    socketRef.current.on('connect', () => {
      console.log('Conexão WebSocket aberta');
      
      socketRef.current?.emit('register', { userId, isManager });
    });

    socketRef.current.on('locationUpdate', (data: LocationUpdate) => {
      setLocation(data); 
    });

    socketRef.current.on('alert', (data: Alert) => {
      setAlert(data); 
    });

    return () => {
      socketRef.current?.disconnect();
      console.log('Conexão WebSocket fechada');
    };
  }, [userId, isManager]);

  return { location, alert };
};
