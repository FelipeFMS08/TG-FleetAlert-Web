import VehicleCommand from "@/dto/commands/vehicle.command";
import VehicleResponse from "@/dto/responses/vehicle.response";

const API_URL = process.env.NEXT_BACKEND_URL || 'http://localhost:3000';

export async function getAllVehicles(): Promise<VehicleResponse[]> {
    const response = await fetch(`${API_URL}/api/vehicles/getAll`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log(response);

    if (!response.ok) {
        throw new Error('Failed to fetch vehicles, check de api response');
    }

    return response.json();
}

export async function createVehicle(vehicleCommand: VehicleCommand): Promise<VehicleResponse> {
    const response = await fetch(`${API_URL}/api/vehicles/create`, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify(vehicleCommand),
    });

    if (!response.ok) { 
        throw new Error('Failed to create a new vehicle, check the API response');
    }

    const data = await response.json(); 

    return data as VehicleResponse;
}
