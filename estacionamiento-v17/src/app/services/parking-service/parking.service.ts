import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IParkingSpot } from '../../interfaces/IParkingSpot';
import { IBarrier } from '../../interfaces/IBarrier';
import { AppConfig } from '../../config/config';
import { HeaderBearerGen } from '../../config/header-bearer';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  
  private apiUrl = `${AppConfig.api}/parking`;

  constructor(private http: HttpClient) {}

    private header = HeaderBearerGen()
  
  getSpots(): Observable<IParkingSpot[]> {
    
    return this.http.get<IParkingSpot[]>(this.apiUrl, {headers: this.header});
  }

  createSpot(spot: IParkingSpot): Observable<IParkingSpot> {
    const payload = {
      name: spot.name,
      location: spot.location
    };
    return this.http.post<IParkingSpot>(this.apiUrl, payload, { headers: this.header });
  }

  deleteSpot(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.header });
  }

  getBarriers(): Observable<IBarrier[]> {
    return this.http.get<IBarrier[]>(`${this.apiUrl}/barrier`, { headers: this.header });
  }

  createBarrier(barrier: IBarrier): Observable<IBarrier> {
    const payload = {
      name: barrier.name,
      status: barrier.status
    };
    return this.http.post<IBarrier>(`${this.apiUrl}/barrier`, payload, { headers: this.header });
  }

  deleteBarrier(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/barrier/${id}`, { headers: this.header });
  }

  toggleBarrierStatus(id: string, newStatus: 'OPEN' | 'CLOSED'): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/barrier/${id}`, { status: newStatus }, { headers: this.header });
  }


}
