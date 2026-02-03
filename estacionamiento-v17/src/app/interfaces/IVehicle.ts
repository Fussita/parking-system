import { IParkingSpot } from "./IParkingSpot";
import { IUser } from "./IUser";

export interface IVehicleEntry {
    id: string;
    vehicle: IVehicle
    status: 'IN' | 'OUT';
    entryTime: string | Date;
    exitTime?: string | Date;
}

export interface IVehicle {
    id: string;
    rfidTag: string;
    plate: string;
    user: IUser
    parking?: IParkingSpot
}

