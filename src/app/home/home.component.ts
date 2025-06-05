import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CoursesComponent } from '../courses/courses.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CalendarComponent } from '../calendar/calendar.component';
import { CalendarEvent } from '../models/event.model';
import { StudysessionComponent } from '../studysession/studysession.component';
import { StreaksComponent } from '../streaks/streaks.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    CoursesComponent,
    CalendarComponent,
    StudysessionComponent,
    StreaksComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  username: string = '';
  helloMessage: string = '';
  courses: string[] = [];
  activeStudyBlock: CalendarEvent | null = null;
  showCourse: boolean = false;
  showCalendar: boolean = true;
  showStudySession: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.determineTimeOfDay();

    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username')!;
    }
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

  logout() {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }

  goToProfile() {
    console.log('Go to Profile');
    this.router.navigate(['/profile']);
  }

  showCoursesView() {
    this.showCourse = true;
    this.showCalendar = false;
    this.showStudySession = false;
  }

  showCalendarView() {
    this.showCourse = false;
    this.showCalendar = true;
    this.showStudySession = false;
  }

  startStudyBlock(event: CalendarEvent) {
    this.activeStudyBlock = event;
    this.showCourse = false;
    this.showCalendar = false;
    this.showStudySession = true;
  }

  endStudyBlock() {
    this.activeStudyBlock = null;
    this.showStudySession = false;
    this.showCalendar = true;
  }

  sessionCompleted(studyBlock: CalendarEvent) {}
}
