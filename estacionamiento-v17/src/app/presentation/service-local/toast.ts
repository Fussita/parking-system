import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  showError(error:string) {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-right",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    })
    
    Toast.fire({
      icon: 'error',
      title: error,
      showClass: {
        popup: `animate__animated animate__fadeInUp animate__faster`
      },
      hideClass: {
        popup: `animate__animated animate__fadeOutDown animate__faster `
      }
    })
  }

  showInfo(text:string) {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-right",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    })
    
    Toast.fire({
      icon: 'info',
      title: text,
      showClass: {
        popup: `animate__animated animate__fadeInUp animate__faster`
      },
      hideClass: {
        popup: `animate__animated animate__fadeOutDown animate__faster `
      }
    })
  }

  showInfoCenter(text:string) {
    const Toast = Swal.mixin({
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    })
    
    Toast.fire({
      icon: 'info',
      title: text,
      showClass: {
        popup: `animate__animated animate__fadeInUp animate__faster`
      },
      hideClass: {
        popup: `animate__animated animate__fadeOutDown animate__faster `
      }
    })
  }

  showSuccess(text:string) {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-right",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    })
    
    Toast.fire({
      icon: 'success',
      title: text,
      showClass: {
        popup: `animate__animated animate__fadeInUp animate__faster`
      },
      hideClass: {
        popup: `animate__animated animate__fadeOutDown animate__faster `
      }
    })
  }

  constructor() { }
}