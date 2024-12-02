import { RouteCommand } from "@/dto/commands/route.command";
import { RouteResponse, RouteTrackingResponse } from "@/dto/responses/routes.response";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getAllRoutes(): Promise<RouteResponse[]> {
    const response = await fetch(`${API_URL}/api/routes/getAll`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log(response);

    if (!response.ok) {
        throw new Error('Failed to fetch routes, check de api response');
    }

    return response.json();
}
export async function getRouteById(routeId: number): Promise<RouteTrackingResponse | null> {
    const routes = await getRoutesByManagerId();
    console.log(routes.find(route => route.route.id === routeId))
    return routes.find(route => route.route.id === routeId) || null;
}

export async function createRoute(routeCommand: RouteCommand): Promise<RouteResponse> {
    const response = await fetch(`${API_URL}/api/routes/create`, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify(routeCommand),
    });

    if (!response.ok) { 
        throw new Error('Failed to create a new vehicle, check the API response');
    }

    const data = await response.json(); 

    return data as RouteResponse;
}

export async function getRoutesByManagerId(): Promise<RouteTrackingResponse[]> {
    const response = await fetch(`${API_URL}/api/routes/findByManagerId`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch routes by managerId, check de api response');
    }

    return response.json();
}

export async function getRoutesByUserId(userId: string): Promise<RouteTrackingResponse[]> {
    const response = await fetch(`${API_URL}/api/routes/findByUserId/${userId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch routes by managerId, check de api response');
    }

    return response.json();
}

export async function deleteRouteById(routeId: number): Promise<boolean> {
    const response = await fetch(`${API_URL}/api/routes/delete/${routeId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch routes by managerId, check de api response');
    }

    return true;
}

