import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../widget/navbar/navbar';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Navbar
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
showNavbar = false;

  toggleNavbar() {
    this.showNavbar = !this.showNavbar;
  }

  closeNavbar() {
    this.showNavbar = false;
  }

}
