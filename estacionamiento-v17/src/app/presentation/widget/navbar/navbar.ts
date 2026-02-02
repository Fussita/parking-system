import { Component, inject } from '@angular/core';
import { UserStore } from '../../../config/user-store';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
user = UserStore.getInstance()
  router = inject(Router)

  goWhere(url: string){
    this.router.navigateByUrl(url)
  }

  logout() {
    try {
      UserStore.getInstance().cleanUser();
    } catch (err) {
    }
    this.router.navigateByUrl('/login');
  }
}
