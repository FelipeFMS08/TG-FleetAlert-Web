import { UserInfosResponse } from "./userInfos.response";
import { UsersResponse } from "./users.response";
import VehicleResponse from "./vehicle.response";

export interface RouteResponse {
    id: number,
    name: string,
    geofencinginfos: string,
    startAddress: string,
    finishAddress: string,
    creator: string,
    creatorid: string;
    vehicle: VehicleResponse,
    user: string,
    status: string,
    alerts?: AlertResponse[]
}

export interface AlertResponse {
    id: number;
    location: string;
    routeId: number;
}

export interface RouteTrackingResponse {
    route: RouteResponse;
    user: UserInfosResponse;
    vehicle: VehicleResponse;
}