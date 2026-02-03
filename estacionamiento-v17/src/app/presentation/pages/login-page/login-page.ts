import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PopUpService } from '../../service-local/toast';
import { UserStore } from '../../../config/user-store';
import { AuthRequest } from '../../../services/auth-service/auth-service';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login-page.html',
  styleUrl:'./login-page.scss',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private popup = inject(PopUpService);
  private authService = inject(AuthRequest)

  ngOnInit() {}

  form = this.fb.group({
    username: ['', [
      Validators.required, 
      Validators.minLength(4),
      Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/) 
    ]],
    password: ['', [
      Validators.required, 
      Validators.minLength(4)
    ]]
  });

  submitting = false;

  onSubmit() {
    if (this.form.invalid) {
      if (this.form.get('username')?.errors?.['required'] || this.form.get('password')?.errors?.['required']) {
        this.popup.showError('Usuario y contraseña son obligatorios');
      } else if (this.form.get('username')?.errors?.['minLength'] || this.form.get('username')?.errors?.['pattern']) {
        this.popup.showError('El usuario recibe letras, números y caracteres especiales y requiere al menos 4 caracteres');
      } else if (this.form.get('password')?.errors?.['minLength']) {
        this.popup.showError('La contraseña debe tener al menos 6 caracteres');
      } else {
        this.popup.showError('Formulario inválido, revise los datos');
      }
      return;
    }

    this.submitting = true;
    const { username, password } = this.form.value as { username: string; password: string };

    this.authService.login({
      email: username,
      password: password
    }).subscribe({
      next: (e: any) => {
        if (e.role != 'Administrador') {
          this.submitting = false;
          this.popup.showError('No tiene Autorización');
        } else {
          const user = UserStore.getInstance()
          user.setUser({ token: e.token, ...e.user })  
          this.router.navigateByUrl('/home')
        }
      },
      error: (e) => {
        this.submitting = false;
        this.popup.showError(e.error.message);
      }
    })

  }

}
