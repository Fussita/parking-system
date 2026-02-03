import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingService } from '../../../services/parking-service/parking.service';
import { VehicleService } from '../../../services/parking-service/vehicle.service';
import { IParkingSpot } from '../../../interfaces/IParkingSpot';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin, take } from 'rxjs'; // Importa take

@Component({
  selector: 'app-parking',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './parking.component.html',
  styleUrl: './parking.component.scss'
})
export class ParkingComponent implements OnInit {
  spots: IParkingSpot[] = [];
  isLoading = false;

  constructor(
    private parkingService: ParkingService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.loadSpots();
  }

  loadSpots(): void {
    this.isLoading = true;
    
    forkJoin({
      spots: this.parkingService.getSpots().pipe(take(1)),            // 1. Obtenemos TODOS los puestos de la BD
      activeVehicles: this.vehicleService.getActiveVehicles().pipe(take(1))
    }).subscribe({
      next: ({ spots, activeVehicles }) => {  
        if (!spots || spots.length === 0) {
          console.warn('La base de datos de puestos está vacía');
          this.spots = [];
        } else {
          this.spots = spots.map(spot => {
            // Buscamos el vehículo activo usando únicamente el ID del puesto
            const vehicleInSpot = activeVehicles.find(v => v.vehicle.parking?.id === spot.id || v.vehicle.parking?.id === spot.id);

            return {
              ...spot,
              // Respetamos el estado 'occupied' del backend o la presencia del vehículo por ID
              occupied: spot.occupied || !!vehicleInSpot,
              vehicle: vehicleInSpot || undefined 
            };
          });
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando datos del estacionamiento', err);
        this.isLoading = false;
      }
    });
  }

  createSpot(): void {
    const nextNum = this.spots.length + 1;
    const newSpot: IParkingSpot = {
      id: '', // El backend asignará el ID
      name: `A-${nextNum.toString().padStart(2, '0')}`,
      location: 'Planta Baja',
      occupied: false,
    };

    this.parkingService.createSpot(newSpot).subscribe({
      next: (serverSpot) => {
        console.log('Puesto creado en servidor', serverSpot);
        
        const finalSpot: IParkingSpot = {
          ...newSpot,       
          ...serverSpot, 
          occupied: false, // Al crear nace desocupado generalmente
        };
        
        this.spots.push(finalSpot);
      },
      error: (err) => {
        console.error('Error creando puesto', err);
        // Manejo de error o rollback visual si es necesario
      }
    });
  }

  deleteSpot(spot: IParkingSpot): void {
    if (spot.occupied) {
      alert('No se puede eliminar un puesto ocupado.');
      return;
    }

    if(!confirm(`¿Estás seguro de eliminar el puesto ${spot.name}?`)) return;

    const originalSpots = [...this.spots];
    this.spots = this.spots.filter(s => s.id !== spot.id);

    // Usamos spot.id como ID según lo conversado
    this.parkingService.deleteSpot(spot.id).subscribe({
      next: () => console.log('Puesto eliminado del backend'),
      error: (err) => {
        console.error('Error eliminando', err);
        this.spots = originalSpots; 
        alert('Error al eliminar el puesto en el servidor');
      }
    });
  }

}

