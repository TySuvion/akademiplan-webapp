import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  username: string = 'Tyler';
  helloMessage: string = '';
  router = new Router();

  ngOnInit() {
    console.log('Home Component Initialized');
    this.determineTimeOfDay();
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
    console.log('Logout');
    //TODO: API Call to logout User
    this.router.navigate(['/login']);
  }

  goToProfile() {
    console.log('Go to Profile');
    this.router.navigate(['/profile']);
  }
}
