import { AlertResponse, RouteResponse } from "./routes.response";
import { UserInfosResponse } from "./userInfos.response";
import VehicleResponse from "./vehicle.response";

export interface ReportsResponse {
    route: RouteResponse;
    vehicle: VehicleResponse,
    user: UserInfosResponse,
    alerts: number,
    time: string;
}