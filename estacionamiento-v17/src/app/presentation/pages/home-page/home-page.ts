import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../widget/navbar/navbar';
import { ChatService } from '../../../services/chat-service/chat-service';
import { PopUpService } from '../../service-local/toast';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Navbar
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  showNavbar = false;
  chatService = inject(ChatService)
  private popup = inject(PopUpService);

  ngOnInit() {
      this.chatService.incident$.subscribe({
        next: (e) => {
          this.popup.showInfoCenter('Nueva Incidencia Detectada');
        }
      })
      
      this.chatService.entry$.subscribe({
        next: (e) => {
          if (e.status == 'IN') this.popup.showInfo('Entrada del Vehiculo Matricula: ' + e.vehicle.plate);
          if (e.status == 'OUT') this.popup.showInfo('Salida del Vehiculo Matricula: ' + e.vehicle.plate);
        }
      })
      
  }

  toggleNavbar() {
    this.showNavbar = !this.showNavbar;
  }

  closeNavbar() {
    this.showNavbar = false;
  }

}
