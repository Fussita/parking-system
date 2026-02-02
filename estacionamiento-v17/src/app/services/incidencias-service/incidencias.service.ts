import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../config/config";
import { HeaderBearerGen } from "../../config/header-bearer";
import { Incidencia } from "../../interfaces/Iincidencias";

@Injectable({ providedIn: 'root'})
export class IncidenciasService {
    private url = `${AppConfig.api}/incident` 
    private http = inject(HttpClient)
    private header = HeaderBearerGen()

    findAll() {
        this.header = HeaderBearerGen()
        return this.http.get<Incidencia[]>(this.url, {headers: this.header})
    }

    create(incidencia: Incidencia) {
        this.header = HeaderBearerGen()
        return this.http.post(this.url, incidencia, {headers: this.header})
    }

    markAsDone(id: string) {
        this.header = HeaderBearerGen()
        return this.http.post(`${this.url}/done/${id}`, {}, {headers: this.header})
    }

    findByUser(userId: string) {
        this.header = HeaderBearerGen()
        return this.http.get<Incidencia[]>(`${this.url}/user/${userId}`, {headers: this.header})
    }

    getChatMessages(incidentId: string) {
        this.header = HeaderBearerGen()
        return this.http.get<any[]>(`${this.url}/chat/${incidentId}`, {headers: this.header})
    }

    update(id: string, incidencia: Incidencia) {
        this.header = HeaderBearerGen()
        return this.http.put(`${this.url}/${id}`, incidencia, {headers: this.header})
    }

    delete(id: string) {
        this.header = HeaderBearerGen()
        return this.http.delete(`${this.url}/${id}`, {headers: this.header})
    }
}
