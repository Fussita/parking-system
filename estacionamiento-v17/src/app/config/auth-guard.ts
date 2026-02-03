import { inject } from '@angular/core';
import { Router, type CanActivateFn, UrlTree } from '@angular/router';
import { UserStore } from './user-store';
import { PopUpService } from '../presentation/service-local/toast';
import { HttpClient } from '@angular/common/http';
import { HeaderBearerGen } from './header-bearer';
import { AppConfig } from './config';
import { catchError, map, of } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const store = UserStore.getInstance();
  const router = inject(Router);
  const popUp = inject(PopUpService);
  const http = inject(HttpClient);
  const header = HeaderBearerGen();

  if (!store.User.token) {
    popUp.showError('No tiene Autorización');
    return router.parseUrl(''); 
  }

  return http.get(`${AppConfig.api}/auth/a`, { headers: header }).pipe(
    map(() => true), 
    catchError(() => {
      popUp.showError('No tiene Autorización');
      return of(router.parseUrl('')); 
    })
  );
};
