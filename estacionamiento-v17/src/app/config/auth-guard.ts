import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserStore } from './user-store';
import { PopUpService } from '../presentation/service-local/toast';

export const AuthGuard: CanActivateFn = async (route, state) => {
  const store = UserStore.getInstance()
  const router = inject(Router)
  const popUp = inject(PopUpService)

  if ( store.User.token == 'TOKEN' || store.User.token == null || store.User.token == '') {
    popUp.showError( 'No tiene Autorizacion' )
    router.navigateByUrl('')
    return false
  }

  if (store.User.token)
    return true
  else {
    popUp.showError( 'No tiene Autorizacion' )
    router.navigateByUrl('')
    return false
  }
}