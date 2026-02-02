import { Incidencia } from "./Iincidencias";
import { IUser } from "./IUser";

export interface IChatMessage {
  id: string;
  incident: Incidencia;
  sender: IUser;
  message: string;
  timestamp: Date;
  
}