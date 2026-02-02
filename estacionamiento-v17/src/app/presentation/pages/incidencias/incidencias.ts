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
  private chatService = inject(ChatService);
  private incidenciasService = inject(IncidenciasService);

  ngOnInit(): void {
      try {
        let user = UserStore.getInstance().User
        if(user && user.id) {
            this.chatService.connect(user.id);
        }
      } catch(e) {
        console.log('Usuario no autenticado para chat');
      }
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

  openChat(item: Incidencia) {
    console.log('Chat abierto para:', item.id);
    this.currentChatIncidencia = item;
    
    // Usamos el ID real de la incidencia
    if (item.id) {
        this.chatService.setContext(item.id);
        this.isChatOpen = true;
    }
  }

  closeChat() {
    this.isChatOpen = false;
    this.currentChatIncidencia = null;
  }

  markResolved(item: Incidencia) {
    console.log('Marcado como resuelto:', item.id);
    item.status = 'Resuelto';
  }

  resolveCurrentChat() {
    if (this.currentChatIncidencia) {
        this.markResolved(this.currentChatIncidencia);
        // Opcional: Cerrar el modal al finalizar
        this.closeChat();
    }
  }
}
