import { Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat-service/chat-service';
import { IChatMessage } from '../../../interfaces/Ichat';
import { Subscription } from 'rxjs';
import { Incidencia } from '../../../interfaces/Iincidencias';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../config/config';
import { HeaderBearerGen } from '../../../config/header-bearer';
import { PopUpService } from '../../service-local/toast';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @Output() resolveIncident = new EventEmitter<void>();

  messages: IChatMessage[] = [];
  newMessage: string = '';
  @Input() chat: Incidencia | null = null
  private popup = inject(PopUpService);
  constructor(private chatService: ChatService) {}
  http = inject(HttpClient)

  ngOnInit(): void {
    if (this.chat) this.messages = this.chat.messages
    
    this.chatService.messages$.subscribe((msg: IChatMessage) => {
      //this.messages.push(msg);
      this.getMessages()
      this.scrollToBottom();
    });
  }

  doneChat() {
    if (!this.chat) return
    let header = HeaderBearerGen()
    this.http.post(`${AppConfig.api}/incident/done/${this.chat.id}`, {}, { headers: header }).subscribe({
      next: (e: any) => {
        this.resolveIncident.emit()
        this.popup.showSuccess( 'Incidencia concluida exitosamente' );
      },
      error: (e: any) => {
        this.popup.showError( 'Error al concluir la Incidencia' );
        
      }
    })
  }

  getMessages() {
    let header = HeaderBearerGen()
    this.http.get(`${AppConfig.api}/incident`, { headers: header }).subscribe({
      next: (e: any) => {
        for (let i of e) {
          if (i.id == this.chat?.id) this.messages = i.messages
        }
      }
    })
  }
  
  sendMessage(): void {
    if (this.newMessage.trim() && this.chat) {
      this.chatService.sendMessage(this.newMessage, this.chat.id);
      this.newMessage = '';
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) 
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }, 100);
  }
}
