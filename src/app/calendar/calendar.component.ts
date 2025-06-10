import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { CalendarEvent } from '../models/event.model';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Course } from '../models/course.model';
import { MarkdownModule } from 'ngx-markdown';
import { WeeklyGoalsComponent } from '../weekly-goals/weekly-goals.component';
import { CoursesComponent } from '../courses/courses.component';
import { UpdateComponentsServiceService } from '../services/update-components-service.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MarkdownModule,
    WeeklyGoalsComponent,
  ],
})
export class CalendarComponent implements OnInit {
  selectedDate: Date = new Date();
  selectedDateSignal: WritableSignal<Date> = signal(this.selectedDate);
  @Output() studyBlockStarted = new EventEmitter<CalendarEvent>();

  events: CalendarEvent[] = [];
  courses: Course[] = [];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private updateComponentsService: UpdateComponentsServiceService
  ) {}

  ngOnInit() {
    this.loadEvents();
    this.apiService.loadCourses().subscribe({
      next: (course) => {
        this.courses = course;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.courses = [];
      },
    });
  }

  loadEvents() {
    const formattedDate = this.selectedDate.toLocaleString('sv').split('T')[0];
    this.apiService.getEventsForDate(formattedDate).subscribe({
      next: (response) => {
        this.events = response.sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        );
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.events = [];
      },
    });
  }

  changeDay(offset: number) {
    this.selectedDate.setDate(this.selectedDate.getDate() + offset);
    const newDate = new Date(this.selectedDate);
    this.selectedDateSignal.set(newDate);
    this.loadEvents();
  }

  jumpToToday() {
    this.selectedDate = new Date();
    this.selectedDateSignal.set(this.selectedDate);
    this.loadEvents();
  }

  openEventDialog() {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: { date: this.selectedDate },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadEvents();
    });
  }

  editEvent(event: CalendarEvent) {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: { event },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadEvents();
    });
  }

  deleteEvent(eventId: number) {
    this.apiService.deleteEvent(eventId).subscribe({
      next: () => {
        this.loadEvents();
        this.updateComponentsService.notifyBlockDeleted(eventId);
      },
      error: (error) => console.error('Error deleting event:', error),
    });
  }

  getCourseName(courseId: number): string {
    const course = this.courses.find((c) => c.id === courseId);
    return course?.name || 'Unknown Course';
  }

  startStudyBlock(event: CalendarEvent) {
    this.studyBlockStarted.emit(event);
  }

  completeStudySession(event: CalendarEvent) {
    this.apiService.completeStudySession(event).subscribe({
      next: () => this.loadEvents(),
      error: (error) => console.error('Error completing study session:', error),
    });
  }
}
