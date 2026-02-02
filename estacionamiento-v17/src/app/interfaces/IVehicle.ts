import { IUser } from "./IUser";

export interface IVehicleEntry {
    id?: string;
    vehicle: {
        id: string;
        rfidTag: string;
        plate: string;
        user: IUser
    }
    status?: 'IN' | 'OUT';
    entryTime?: string | Date;
    exitTime?: string | Date;
    date?: string | Date;
    parkingSpotId?: string;
    spotId?: string;
    
}

