import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbChatModule } from '@nebular/theme'; 
import { Incidencia } from '../../../interfaces/Iincidencias';
import { ChatComponent } from '../../widget/chat/chat.component';
import { ChatService } from '../../../services/chat-service/chat-service';
import { IncidenciasService } from '../../../services/incidencias-service/incidencias.service';
import { UserStore } from '../../../config/user-store';

@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [
    CommonModule,
    NbChatModule,
    ChatComponent],
  templateUrl: './incidencias.html',
  styleUrl: './incidencias.scss',
})
export class Incidencias implements OnInit {
  allIncidencias: Incidencia[] = [];
  filteredIncidencias: Incidencia[] = [];
  isChatOpen = false;
  currentChatIncidencia: Incidencia | null = null;
  private incidenciasService = inject(IncidenciasService);

  ngOnInit(): void {
      this.loadIncidencias();
  }

  loadIncidencias() {
    this.incidenciasService.findAll().subscribe({
      next: (data) => {
        this.allIncidencias = data;
        this.filteredIncidencias = [...this.allIncidencias];
      },
      error: (err) => console.error('Error cargando incidencias', err)
    });
  }

  filterByStatus(event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    
    if (status === 'Todos') {
      this.filteredIncidencias = [...this.allIncidencias];
    } else if (status === 'OPEN') {
        this.filteredIncidencias = this.allIncidencias.filter(item => 
          item.status?.toUpperCase() === 'OPEN' || item.status === 'Pendiente'
        );
    } else if (status === 'CLOSED') {
        this.filteredIncidencias = this.allIncidencias.filter(item => 
          item.status?.toUpperCase() === 'CLOSED' || item.status === 'Resuelto'
        );
    }
  }

  chat: Incidencia | null = null

  openChat(item: Incidencia) {
    this.currentChatIncidencia = item;
    this.chat = item
    if (item.id) this.isChatOpen = true;
  }

  closeChat() {
    this.isChatOpen = false;
    this.chat = null
    this.currentChatIncidencia = null;
  }

  markResolved(item: Incidencia) {
    item.status = 'CLOSED';
  }

  resolveCurrentChat() {
    if (this.currentChatIncidencia) {
        this.markResolved(this.currentChatIncidencia);
        // Opcional: Cerrar el modal al finalizar
        this.closeChat();
    }
  }
}
