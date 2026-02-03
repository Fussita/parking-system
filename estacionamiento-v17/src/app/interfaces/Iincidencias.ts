import { IChatMessage } from "./Ichat";
import { IUser } from "./IUser";

export interface Incidencia {
  id: string;
  title: string;
  description: string;
  createdAt: string | Date;
  closedAt: string | Date;
  status: string; 
  user: IUser;
  messages: IChatMessage[]
}
