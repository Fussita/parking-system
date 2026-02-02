import { IUser } from "./IUser";

export interface Incidencia {
  id: string;
  title: string;
  description: string;
  createdAt: string | Date;
  status?: string; 
  user: IUser;
}