import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParkingService } from '../../../services/parking-service/parking.service';
import { VehicleService } from '../../../services/parking-service/vehicle.service';
import { forkJoin, interval, Subscription } from 'rxjs';
import { IVehicleEntry } from '../../../interfaces/IVehicle';
import { DashboardService } from '../../../services/dashboard-service/dashboard.service';
import { IBarrier } from '../../../interfaces/IBarrier';
import { ChatService } from '../../../services/chat-service/chat-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  // Servicios
  private dashboardService = inject(DashboardService);
  private parkingService = inject(ParkingService);
  private vehicleService = inject(VehicleService);
  private chatService = inject(ChatService);
  private platformId = inject(PLATFORM_ID);

  private pollingSubscription?: Subscription;
  private barrierSubscription?: Subscription;

  stats: {title: string, value: string | number}[] = [
    { title: 'Recaudación Total', value: '$ 0.00' },
    { title: 'Ocupación Total', value: '0%' },
    { title: 'Espacios Libres', value: '0' },
    { title: 'Incidencias Finalizadas', value: '0' }
  ];

  monthlySales: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  maxMonthly = 1;
  monthlyNormalized: number[] = [];

  totalCapacity = 0;
  occupiedSpaces = 0;
  occupancyPercentage = 0;
  totalAmount = 0;
  totalIncidents = 0;

  recentActivity: { 
    label: string, 
    user: string,
    amount: string, 
    time: string,
    date: string,
    type: string
  } [] = [];

  // Estado de las barreras (Simuladas)
  entryBarrierOpen = false;
  exitBarrierOpen = false;

  barriers: IBarrier[] = [];
  
  activeAction: 'create' | 'delete' | null = 'create';
  newBarrierName: string = '';
  deleteBarrierName: string = '';

  selectedBarrierId: string | null = null;
  selectedBarrier: IBarrier | undefined;

  ngOnInit(): void {
    this.updateStats();
    
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
      this.startPolling();
      this.listenToBarrierChanges();
    }
  }

  listenToBarrierChanges() {
    this.barrierSubscription = this.chatService.barrier$.subscribe((updatedBarrier) => {
      const index = this.barriers.findIndex(b => b.id === updatedBarrier.id);
      if (index !== -1) {
        this.barriers[index] = { ...this.barriers[index], ...updatedBarrier };
        
        // Si la barrera actualizada es la seleccionada, actualizar la referencia
        if (this.selectedBarrierId === updatedBarrier.id) {
          this.selectedBarrier = { ...this.barriers[index] };
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
    if (this.barrierSubscription) {
      this.barrierSubscription.unsubscribe();
    }
  }

  startPolling() {
    this.pollingSubscription = interval(5000).subscribe(() => {
      this.loadDashboardData();
    });
  }

  updateStats() {
    this.stats = [
      { title: 'Recaudación Total', value: `$ ${this.totalAmount}` },
      { title: 'Ocupación Total', value: `${this.occupancyPercentage}%` },
      { title: 'Espacios Libres', value: this.totalCapacity - this.occupiedSpaces },
      { title: 'Incidencias Finalizadas', value: this.totalIncidents }
    ];
  }


  loadDashboardData() {
    forkJoin({
      occupancy: this.dashboardService.getOccupancyPercentage(),
      freeSpaces: this.dashboardService.getFreeSpaces(),
      monthlyIncome: this.dashboardService.getMonthlyIncome(),
      closedIncidents: this.dashboardService.getClosedIncidents(),
      annualIncomeArray: this.dashboardService.getAnnualIncome(),
      spots: this.parkingService.getSpots(),
      entries: this.vehicleService.getVehiclesEntries(),
      barriers: this.parkingService.getBarriers()
    }).subscribe({
      next: ({ occupancy, freeSpaces, monthlyIncome, closedIncidents, annualIncomeArray, spots, entries, barriers }) => {
        this.occupancyPercentage = occupancy.occupancy || 0;
        const freeCount = freeSpaces.freeSpaces || 0;
        this.totalIncidents = closedIncidents.closedIncidents || 0;
        this.totalAmount = annualIncomeArray.annualIncome || 0;

        console.log(entries)

        this.barriers = barriers;

        this.totalCapacity = (spots as any)?.length || 0;
        this.occupiedSpaces = this.totalCapacity - freeCount;

        // Actualización de cards
        this.stats = [
          { title: 'Recaudación Anual', value: `$ ${this.totalAmount.toLocaleString()}` },
          { title: 'Ocupación Total', value: `${this.occupancyPercentage}%` },
          { title: 'Espacios Libres', value: freeCount },
          { title: 'Incidencias Finalizadas', value: this.totalIncidents }
        ];

        let newMonthly: number[] = new Array(12).fill(0);
        
        const meses: { [key: string]: number } = {
          'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
          'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
        };

        if (monthlyIncome) {
          Object.entries(monthlyIncome).forEach(([key, value]) => {
            const lowerKey = key.toLowerCase();
            if (meses[lowerKey] !== undefined) {
              newMonthly[meses[lowerKey]] = value as number;
            }
          });
        }
        
        this.monthlySales = newMonthly;
        this.maxMonthly = Math.max(...(this.monthlySales)) || 1;
        this.monthlyNormalized = this.monthlySales.map(v => Math.round((v / this.maxMonthly) * 100));

        const entriesList = (entries as IVehicleEntry[]) || [];
        this.recentActivity = entriesList.slice(-10).reverse().map(entry => {
          const isEntry = entry.status === 'IN';
          return {
            label: isEntry ? `Entrada: ${entry.vehicle.plate}` : `Salida: ${entry.vehicle.plate}`,
            user: entry.vehicle.user.name || 'Desconocido',
            amount: !isEntry ? 'Finalizado' : 'En curso',
            time: this.formatTime(isEntry ? entry.entryTime : entry.exitTime),
            date: entry.date ? this.formatDate(new Date(entry.date)) : 'N/A',
            type: entry.status || 'IN'
          };
        });
      }
    });
  }

  formatTime(date: any) {
    if (!date) return 'Ahora';
    const newd = new Date(date.toString());
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(newd);
  }

  toggleEntryBarrier() {
    this.entryBarrierOpen = !this.entryBarrierOpen;
  }

  toggleExitBarrier() {
    this.exitBarrierOpen = !this.exitBarrierOpen;
  }

  formatDate(date: Date) {
    const newd = new Date(date.toString())
    const formato = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
    }).format(newd);
    
    return formato
  }

  showCreateForm() {
    this.activeAction = 'create';
    this.newBarrierName = '';
  }

  showDeleteForm() {
    this.activeAction = 'delete';
    this.deleteBarrierName = '';
  }

  submitCreateBarrier() {
    if (!this.newBarrierName.trim()) return;

    const newBarrier: any = {
      name: this.newBarrierName,
      status: 'CLOSED'
    };

    this.parkingService.createBarrier(newBarrier).subscribe({
      next: () => {
        this.newBarrierName = '';
        this.refreshBarriers();
        // activeAction stays 'create' as default
      },
      error: (err) => {
        console.error('Error creating barrier', err);
        alert('Error al crear barrera');
      }
    });
  }

  submitDeleteBarrier() {
    if (!this.deleteBarrierName.trim()) return;

    const barrierToDelete = this.barriers.find(b => b.name.toLowerCase() === this.deleteBarrierName.toLowerCase());

    if (barrierToDelete) {
      this.parkingService.deleteBarrier(barrierToDelete.id).subscribe({
        next: () => {
          this.deleteBarrierName = '';
          this.refreshBarriers();
        },
        error: (err) => {
          console.error('Error deleting barrier', err);
          alert('Error al eliminar barrera');
        }
      });
    } else {
      alert('No se encontró ninguna barrera con ese nombre');
    }
  }

  refreshBarriers() {
    this.parkingService.getBarriers().subscribe(barriers => {
      this.barriers = barriers;
      if (this.selectedBarrierId) {
        this.selectedBarrier = this.barriers.find(b => b.id === this.selectedBarrierId);
      }
    });
  }

  selectBarrier(barrier: IBarrier) {
    if (this.selectedBarrierId === barrier.id) {
      this.selectedBarrierId = null; 
      this.selectedBarrier = undefined;
    } else {
      this.selectedBarrierId = barrier.id;
      this.selectedBarrier = barrier;
    }
  }

  toggleSelectedBarrier(status: 'OPEN' | 'CLOSED') {
    if (!this.selectedBarrier) return;

    const prevStatus = this.selectedBarrier.status;
    this.selectedBarrier.status = status;
    
    const index = this.barriers.findIndex(b => b.id === this.selectedBarrier!.id);
    if (index !== -1) {
      this.barriers[index].status = status;
    }
  }
}
