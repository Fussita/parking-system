import { Component, inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopUpService } from '../../service-local/toast';
import { TarifasService } from '../../../services/tarifas-service/tarifas.service';
import { ITarifa } from '../../../interfaces/ITarifa';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-tarifas',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: 'tarifas.html',
  styleUrl: 'tarifas.scss',
})
export class Tarifas {
  tarifas: ITarifa[] = [];
  showCreateForm = false;
  editingTarifa: ITarifa | null = null;
  private allTarifas: ITarifa[] = [];
  tarifaService = inject(TarifasService);
  private popup = inject(PopUpService);
  inpSearch = new FormControl('');

  ngOnInit() {
    this.gets();
  }
  

  formTarifa = {
    name: '',
    description: '',
    ratePerHour: 0
  };

  gets() {
    this.tarifaService.findAll().subscribe({
      next: (e: any) => {
        this.tarifas = e;
        this.allTarifas = Array.isArray(e) ? e : [];
      },
      error: (e) => {
        this.popup.showError(e.error.message);
      }
    });
  }

  openCreate() {
    this.resetForm();
    this.showCreateForm = true;
    this.editingTarifa = null;
  }

  closeCreate() {
    this.showCreateForm = false;
    this.editingTarifa = null;
  }

  saveTarifa() {
      if (!this.formTarifa.name || !this.formTarifa.description || this.formTarifa.ratePerHour <= 0) {
          this.popup.showError('Datos inválidos');
          return;
      }

      const tarifaData: ITarifa = {
          name: this.formTarifa.name,
          description: this.formTarifa.description,
          ratePerHour: this.formTarifa.ratePerHour,
          active: true 
      };

      if (this.editingTarifa && (this.editingTarifa.id)) {
          
          this.tarifaService.update(this.editingTarifa.id, tarifaData).subscribe({
              next: () => {
                  this.popup.showSuccess('Tarifa actualizada');
                  this.gets();
                  this.closeCreate();
              },
              error: (err) => this.popup.showError(err.error?.message || 'Error actualizando')
          });
      } else {
          
          this.tarifaService.create(tarifaData).subscribe({
              next: () => {
                  this.popup.showSuccess('Tarifa creada');
                  this.gets();
                  this.closeCreate();
              },
              error: (err) => this.popup.showError(err.error?.message || 'Error creando')
          });
      }
  }

  deleteTarifa(id: string) {
    const ok = window.confirm('¿Estás seguro que deseas eliminar esta tarifa?');
    if (!ok) return;
    this.tarifaService.delete(id).subscribe({
      next: () => {
        this.popup.showSuccess('Tarifa eliminada');
        this.gets();
      },
      error: (e) => {
        this.popup.showError(e?.error?.message || 'Error al eliminar tarifa');
      }
    });
  }

  editTarifa(tarifa: ITarifa) {
      this.editingTarifa = tarifa;
      this.formTarifa = {
          name: tarifa.name,
          description: tarifa.description,
          ratePerHour: tarifa.ratePerHour
      };
      this.showCreateForm = true;
  }

  applyLocalFilter() {
    const q = (this.inpSearch.value || '').toString().toLowerCase().trim();
    if (!q) {
      this.tarifas = [...this.allTarifas];
      return;
    }

    this.tarifas = this.allTarifas.filter(p => {
      const desc = (p.description || '').toString().toLowerCase();
      return desc.includes(q);
    });
  }

  resetForm() {
      this.formTarifa = {
        name: '',
        description: '',
        ratePerHour: 0
      };
  }
}
