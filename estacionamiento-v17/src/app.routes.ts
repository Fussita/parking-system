import { Routes } from '@angular/router';
import { LoginPage } from './app/presentation/pages/login-page/login-page';
import { AuthGuard } from './app/config/auth-guard';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  }
  ,
  {
    path: 'home',
    canActivate: [ AuthGuard ],
    loadChildren: () => import('./home.routes').then(m => m.HomeRoutes)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
