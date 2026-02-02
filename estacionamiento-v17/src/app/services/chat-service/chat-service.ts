import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { IChatMessage } from '../../interfaces/Ichat';
import { UserStore } from '../../config/user-store';
import { IUser } from '../../interfaces/IUser';
import { IBarrier } from '../../interfaces/IBarrier';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  private socket: Socket | null = null;
  private messageSubject = new Subject<IChatMessage>();
  public messages$ = this.messageSubject.asObservable();
  private barrierSubject = new Subject<IBarrier>();
  public barrier$ = this.barrierSubject.asObservable();
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

    this.socket.on('barriedMoved', (payload: { entry: IBarrier }) => {
      console.log('Barrera movida:', payload.entry);
      this.barrierSubject.next(payload.entry);
    });

    this.socket.on('disconnect', () => {
      console.warn(' Chat Desconectado');
    });
  }

  
  public setContext(incidentId: string) {
    this.currentIncidentId = incidentId;
    this.joinIncidentRoom(incidentId);
  }

  
  public joinIncidentRoom(incidentId: string) {
    if (!this.socket) return;
    this.socket.emit('joinIncident', { incidentId });
  }

  
  public sendMessage(message: string): void {
    const userStore = UserStore.getInstance();
    
    if (!this.socket || !this.socket.connected) {
        console.warn('Socket desconectado, intentando reconectar...');
        
        if (userStore.isValid()) {
             const userId = userStore.getUserId();
             console.log('Intentando reconectar con Usuario ID:', userId);
             
             if (userId) {
                 this.connect(userId);
             } else {
                 console.error('El usuario tiene sesión pero no tiene ID válido:', userStore.User);
             }
        } else {
            console.error('El UserStore no tiene una sesión válida. No se puede reconectar.');
        }
    }

    if (!this.socket) {
        console.error('ERROR FATAL: Socket sigue siendo null tras intento de conexión.');
        return;
    }

    if (!this.currentIncidentId) {
        console.warn('No hay incidencia seleccionada para enviar mensaje');
        return;
    }
    
    if (!userStore.isValid()) {
         console.error('No hay usuario autenticado');
         return;
    }
    
    const userId = userStore.getUserId();
    if (!userId) {
        console.error('CRITICAL: Usuario autenticado pero sin ID. No se puede enviar mensaje.');
        return;
    }


    const payload = {
        message,
        incidentId: this.currentIncidentId,
        userId: userId
    };
    this.socket.emit('sendMessage', payload);

    const myMessage: IChatMessage = {
        id: 'temp-' + Date.now(),
        message: message,
        timestamp: new Date(),
        incident: { id: this.currentIncidentId } as any, 
        sender: userStore.User,
        
    };
    this.messageSubject.next(myMessage);
  }

  private handleIncomingMessage(data: any) {
    console.log('Mensaje recibido del socket:', data);

    const chatMsg: IChatMessage = {
        id: data.id || Date.now().toString(),
        message: data.message || '',
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
        sender: data.sender || { name: 'Desconocido', id: '0' }, 
        incident: data.incident || { id: '0' } 
    };

    this.messageSubject.next(chatMsg);
  }

  public disconnect() {
    if (this.socket) this.socket.disconnect();
  }
}

