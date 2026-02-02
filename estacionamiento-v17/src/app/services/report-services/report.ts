import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../config/config";
import { HeaderBearerGen } from "../../config/header-bearer";
import { ICountAllResponse, IMonthlyReport } from "../../interfaces/IReport";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root'})
export class ReportsRequest {
    private url = `${AppConfig.api}/payment` 
    private http = inject(HttpClient)
    private header = HeaderBearerGen()

    monthly(): Observable<IMonthlyReport[]> {
        this.header = HeaderBearerGen()
        return this.http.get<IMonthlyReport[]>(this.url+'/monthly', {headers: this.header})
    }

    countAll(): Observable<ICountAllResponse> {
        this.header = HeaderBearerGen()
        return this.http.get<ICountAllResponse>(this.url+'/count', {headers: this.header})
    }


    topProducts() {
        this.header = HeaderBearerGen()
        return this.http.get(this.url+'/products', {headers: this.header})
    }


}