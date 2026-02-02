import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../config/config";
import { HeaderBearerGen } from "../../config/header-bearer";
import { ITarifa } from "../../interfaces/ITarifa";

@Injectable({ providedIn: 'root'})
export class TarifasService {
    private url = `${AppConfig.api}/tariff` 
    private http = inject(HttpClient)
    private header = HeaderBearerGen()

    findAll() {
        this.header = HeaderBearerGen()
        return this.http.get<ITarifa[]>(this.url, {headers: this.header})
    }

    create(tarifa: ITarifa) {
        this.header = HeaderBearerGen()
        return this.http.post(this.url, tarifa, {headers: this.header})
    }

    update(id: string, tarifa: ITarifa) {
        this.header = HeaderBearerGen()
        return this.http.put(`${this.url}/${id}`, tarifa, {headers: this.header})
    }

    delete(id: string) {
        this.header = HeaderBearerGen()
        return this.http.delete(`${this.url}/${id}`, {headers: this.header})
    }
}