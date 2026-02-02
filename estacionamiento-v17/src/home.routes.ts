import { Routes } from "@angular/router";
import { HomePage } from "./app/presentation/pages/home-page/home-page";
import { Dashboard } from "./app/presentation/pages/dashboard/dashboard";
import { Tarifas } from "./app/presentation/pages/tarifas/tarifas";
import { Tickets } from "./app/presentation/pages/tickets/tickets";
import { Historial } from "./app/presentation/pages/tickets/historial/historial";
import { Incidencias } from "./app/presentation/pages/incidencias/incidencias";
import { ParkingComponent } from "./app/presentation/pages/parking/parking.component";

export const HomeRoutes: Routes = [
    {
        path: '',
        canActivate: [],
        component: HomePage,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                component: Dashboard,
            },
            {
                path: 'tarifas',
                component: Tarifas,
            },
            {
                path: 'tickets/historial',
                component: Historial,
            },
            {
                path: 'incidencias',
                component: Incidencias,
            },
            {
                path: 'parking',
                component: ParkingComponent,
            },
            {
                path: '**',
                redirectTo: 'dashboard'  
            },
        ]
    }


]