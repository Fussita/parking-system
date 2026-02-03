import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { IChatMessage } from '../../interfaces/Ichat';
import { UserStore } from '../../config/user-store';
import { IBarrier } from '../../interfaces/IBarrier';
import { Incidencia } from '../../interfaces/Iincidencias';
import { IVehicleEntry } from '../../interfaces/IVehicle';

@Injectable({ providedIn: 'root' })
export class ChatService {
  
  private socket: Socket | null = null;
  private messageSubject = new Subject<IChatMessage>();
  private barrierSubject = new Subject<IBarrier>();
  private incidentSubject = new Subject<Incidencia>();
  private entrySubject = new Subject<IVehicleEntry>();
  
  public messages$ = this.messageSubject.asObservable();
  public barrier$ = this.barrierSubject.asObservable();
  public incident$ = this.incidentSubject.asObservable();
  public entry$ = this.entrySubject.asObservable();

  private readonly BACKEND_URL = 'http://localhost:3000';
  private currentIncidentId: string | null = null;

  constructor() {
    this.autoConnect();
  }

  private autoConnect() {
    if (typeof window !== 'undefined') {
        const userStore = UserStore.getInstance();
        if (userStore.isValid()) {
            const userId = userStore.getUserId();
            if (userId) this.connect(userId);
        }
    }
  }

  public connect(userId: string): void {
    if (this.socket && this.socket.connected) return;

    this.socket = io(this.BACKEND_URL, {
      query: { userId }, 
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Chat Conectado:', this.socket?.id);
    });

    this.socket.on('receiveMessage', (payload: any) => {
      this.handleIncomingMessage(payload);
    });

    this.socket.on('newIncident', (payload: any) => {
      this.handleNewIncident(payload);
    });

    this.socket.on('vehicleEntry', (payload: any) => {
      this.handleNewEntry(payload);
    });

    this.socket.on('barriedMoved', (payload: { entry: IBarrier }) => {
      this.barrierSubject.next(payload.entry);
    });

    this.socket.on('disconnect', () => {
      console.warn(' Chat Desconectado');
    });
  }

  public handleNewIncident( entry: Incidencia ) {
    this.incidentSubject.next(entry)
  }

  public handleNewEntry( entry: IVehicleEntry ) {
    this.entrySubject.next(entry)
  }

  public sendMessage(message: string, incidentId: string): void {
    const userStore = UserStore.getInstance();
    const userId = userStore.getUserId()
    if (!this.socket || !this.socket.connected) 
        console.warn('Socket desconectado, intentando reconectar...');
    if (!this.socket) return
    const payload = { message, incidentId: incidentId, userId: userId };
    this.socket.emit('sendMessage', payload);
    //this.messageSubject.next(myMessage);
  }

  private handleIncomingMessage(data: any) {
    this.messageSubject.next(data);
  }

  public disconnect() {
    if (this.socket) this.socket.disconnect();
  }
}

