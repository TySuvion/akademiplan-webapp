import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CoursesComponent } from '../courses/courses.component';

@Component({
  selector: 'app-home',
  imports: [CoursesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  username: string = '';
  helloMessage: string = '';
  courses: string[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.determineTimeOfDay();

    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username')!;
    }

    this.loadCourses();
  }

  determineTimeOfDay() {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      this.helloMessage = 'Guten Morgen';
    } else if (currentHour < 18) {
      this.helloMessage = 'Guten Nachmittag';
    } else {
      this.helloMessage = 'Guten Abend';
    }
  }

  loadCourses() {
    this.apiService.loadCourses().subscribe({
      next: (response) => {
        this.courses = response.body.map((course: any) => course.name);
        console.log('Courses loaded successfully:', this.courses);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      },
    });
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
