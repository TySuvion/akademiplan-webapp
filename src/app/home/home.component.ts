import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  username: string = '';
  helloMessage: string = '';
  router = new Router();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    console.log('Home Component Initialized');
    this.determineTimeOfDay();

    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username')!;
    }
  }

  determineTimeOfDay() {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      this.helloMessage = 'Good Morning';
    } else if (currentHour < 18) {
      this.helloMessage = 'Good Afternoon';
    } else {
      this.helloMessage = 'Good Evening';
    }
  }

  logout() {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }

  goToProfile() {
    console.log('Go to Profile');
    this.router.navigate(['/profile']);
  }
}
