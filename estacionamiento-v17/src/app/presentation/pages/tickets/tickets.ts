import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderRequest } from '../../../services/order-service/order';
import { IOrder } from '../../../interfaces/Iorder';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss'
})
export class Tickets implements OnInit {
  orderService = inject(OrderRequest);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  Demotickets: IOrder [] = [
    {
      _id: '1',date: new Date('2024-05-20T10:00:00'),total: 0,status: 'parked',paid: false,iva: 0,orderId: 1001,plate: 'ABC-123'
    },
    {_id: '2',date: new Date('2024-05-20T11:30:00'),total: 0,status: 'parked',paid: false,iva: 0,orderId: 1002,plate: 'XYZ-789'
    },
    {_id: '3',date: new Date('2024-05-20T12:15:00'),total: 0,status: 'parked',paid: false,iva: 0,orderId: 1003,plate: 'LMN-456'
    }
  ];
  activeTickets: IOrder[] = [];
  plateInput = new FormControl('');
  isProcessing = false;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.refreshTickets();
    }
  }

  refreshTickets() {
    this.orderService.findAll().subscribe({
      next: (res: any) => {
        const all = Array.isArray(res) ? res : [];
        this.activeTickets = all.filter((t: IOrder) => !t.paid);
      },
      error: () => {
        console.warn('Backend offline, usando datos simulados');
        
  }
});
  }
  

  registerEntry() {
    if (this.isProcessing) return;
    const plate = this.plateInput.value?.trim().toUpperCase();
    if (!plate) return;
    
    this.isProcessing = true;
    this.orderService.createOrder({ 
        plate: plate, 
        // Si tienes el ID del usuario logueado en un store, inyectalo aquí
        // userId: this.userStore.userId 
    }).subscribe({
        next: (res: any) => {
            // Asumimos que el backend devuelve el objeto creado
            // Si devuelve solo ID, habrá que consultar o armar el objeto local
            this.Demotickets.unshift(res.order || res); 
            this.plateInput.setValue('');
            this.isProcessing = false;
        },
        error: (err) => {
            console.error('Error (Offline Mode): Generando ticket local', err);
            
            // Fallback: Crear ticket simulado para la Demo
            const newMock: IOrder = {
                _id: Math.random().toString(36).substring(7),
                orderId: Math.floor(Math.random() * 9000) + 1000,
                plate: plate, 
                date: new Date(),
                total: 0,
                status: 'parked',
                paid: false,
                iva: 0
            };
            
            // Simular respuesta positiva visualmente
            this.activeTickets.unshift(newMock);
            this.plateInput.setValue('');
            this.isProcessing = false;   
        }
    });
  }

  processExit(ticket: IOrder) {
      // Simulamos calculo de tiempos
      const exitTime = new Date();
      const hours = 2; // Simulado fijo por ahora
      const rateCost = 15.00; // Tarifa actual simulada
      const total = hours * rateCost;
      
      const confirm = window.confirm(`
        Placa: ${ticket.plate || '---'}
        Total a pagar: $${total}
        (Tiempo: ${hours}h x $${rateCost})
        ¿Confirmar salida?`);

      if (confirm) {
          // Llenamos el snapshot para auditoría
          ticket.exitDate = exitTime;
          ticket.total = total;
          ticket.paid = true;
          ticket.rateSnapshot = {
              cost: rateCost,
              type: 'General Por Hora',
              exitDate: exitTime
          };

          // Enviamos al backend
          
          // Actualizamos vista local
          this.activeTickets = this.activeTickets.filter(t => t._id !== ticket._id);
      }
  }

  goToHistory() {
    // El prefijo '/home' es necesario porque tickets está bajo el módulo 'home'
    this.router.navigateByUrl('/home/tickets/historial');
  }
}
