import { IUser } from "./IUser";

export interface IOrder {
    _id: string
    date: Date;
    user?: IUser | null
    total: number
    status: string
    paid: boolean
    iva: number
    orderId: number

    // Propiedades nuevas para gestión de Estacionamiento
    exitDate?: Date;
    plate?: string;  // Placa del vehículo
    rateSnapshot?: { // La "foto" de la tarifa que se cobró
        cost: number;
        type: string;
        exitDate?: Date;
    };
}