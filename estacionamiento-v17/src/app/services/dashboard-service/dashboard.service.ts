import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../config/config';
import { HeaderBearerGen } from '../../config/header-bearer';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${AppConfig.api}/dashboard`;
  private http = inject(HttpClient);

  getOccupancyPercentage(): Observable<{ occupancy: number }> {
    const headers = HeaderBearerGen();
    return this.http.get<{ occupancy: number }>(`${this.apiUrl}/occupancy`, { headers });
  }

  getFreeSpaces(): Observable<{ freeSpaces: number }> {
    const headers = HeaderBearerGen();
    return this.http.get<{ freeSpaces: number }>(`${this.apiUrl}/free-spaces`, { headers });
  }

  getMonthlyIncome(): Observable<{ [month:string]: number }> {
    const headers = HeaderBearerGen();
    return this.http.get<{ [month:string]: number }>(`${this.apiUrl}/monthly-income`, { headers });
  }

  getClosedIncidents(): Observable<{ closedIncidents: number }> {
    const headers = HeaderBearerGen();
    return this.http.get<{ closedIncidents: number }>(`${this.apiUrl}/closed-incidents`, { headers});
  }

  getAnnualIncome(): Observable<{ annualIncome:number }> {
    const headers = HeaderBearerGen();
    return this.http.get<{ annualIncome:number }>(`${this.apiUrl}/annual-income`, { headers });
  }
}
