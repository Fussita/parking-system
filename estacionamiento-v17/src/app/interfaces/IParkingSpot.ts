import { IVehicleEntry } from "./IVehicle";

export interface IParkingSpot {
    id: string;
    name: string;         
    location: string;     
    occupied: boolean;
    vehicle?: IVehicleEntry 
}
