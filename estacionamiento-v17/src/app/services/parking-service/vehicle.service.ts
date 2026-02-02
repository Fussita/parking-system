import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AppConfig } from '../../config/config';
import { HeaderBearerGen } from '../../config/header-bearer';
import { IVehicleEntry } from '../../interfaces/IVehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${AppConfig.api}/vehicle`;
  private header = HeaderBearerGen();

  constructor(private http: HttpClient) {}

  
  getActiveVehicles(): Observable<IVehicleEntry[]> {
    return this.http.get<IVehicleEntry[]>(this.apiUrl + '/entry', { headers: this.header }).pipe(
      map(vehicles => vehicles.filter(v => v.exitTime === null))
    );
  }

  getAllVehicles(): Observable<IVehicleEntry[]> {
    return this.http.get<IVehicleEntry[]>(this.apiUrl + '/entry', { headers: this.header });
  }

  getVehiclesEntries(): Observable<IVehicleEntry[]> {
    this.header = HeaderBearerGen();
    return this.http.get<IVehicleEntry[]>(this.apiUrl + '/entry', { headers: this.header });
  }
  
}