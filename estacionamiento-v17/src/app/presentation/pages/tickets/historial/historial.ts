import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OrderRequest } from '../../../../services/order-service/order';
import { IOrder } from '../../../../interfaces/Iorder';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historial.html',
  styleUrl: './historial.scss',
})
export class Historial implements OnInit {
  orderService = inject(OrderRequest);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  //tickets para demo
  historyTickets: IOrder[] = [
    { _id: '101', orderId: 5021, plate: 'JGS-902', date: new Date(new Date().setHours(8)), exitDate: new Date(new Date().setHours(10)), total: 25.00, paid: true, status: 'completed', iva: 4.0 },
    { _id: '102', orderId: 5022, plate: 'HXA-114', date: new Date(new Date().setDate(new Date().getDate()-1)), exitDate: new Date(new Date().setDate(new Date().getDate()-1)), total: 50.00, paid: true, status: 'completed', iva: 8.0 },
    { _id: '103', orderId: 5015, plate: 'MOP-888', date: new Date('2024-12-20T09:00:00'), exitDate: new Date('2024-12-20T13:30:00'), total: 120.00, paid: true, status: 'completed', iva: 19.2 },
    { _id: '104', orderId: 5001, plate: 'AAA-001', date: new Date('2024-11-15T14:00:00'), exitDate: new Date('2024-11-15T15:00:00'), total: 15.00, paid: true, status: 'completed', iva: 2.4 }
         
  ];
  //filtered es el real que funcionaria con la base de datos
  filteredTickets: IOrder[] = [];
  
  searchInput = new FormControl('');

  ngOnInit() {
    this.searchInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.applyFilter());

    if (isPlatformBrowser(this.platformId)) {
        this.loadHistory();
    }
  }

  loadHistory() {
    this.orderService.findAll().subscribe({
      next: (res: any) => {
        // Filtramos tickets PAGADOS / COMPLETADOS
        const all = Array.isArray(res) ? res : [];
        this.historyTickets = all.filter((t: IOrder) => t.paid === true);
        this.historyTickets.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.filteredTickets = [...this.historyTickets];
      },
      error: () => {
        console.warn('Backend offline, usando datos simulados');
      }
    });
  }

  applyFilter() {
    const term = (this.searchInput.value || '').trim().toLowerCase();
    
    if (!term) {
      this.filteredTickets = [...this.historyTickets];
      return;
    }

    this.filteredTickets = this.historyTickets.filter(t => {
      // Búsqueda por Placa o ID
      const matchPlate = (t.plate || '').toLowerCase().includes(term);
      const matchId = t.orderId.toString().includes(term);
      return matchPlate || matchId;
    });
  }
  goToActive(){
    this.router.navigateByUrl('/home/tickets');
  }
}
