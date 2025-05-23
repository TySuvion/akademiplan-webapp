import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CalendarEvent } from '../models/event.model';
import { CoursesComponent } from '../courses/courses.component';
import { Course } from '../models/course.model';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
})
export class EventDialogComponent {
  eventForm: FormGroup;
  courses: Course[] = [];

  constructor(
    private dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.eventForm = this.formBuilder.group({
      type: [data.event?.type || 'CALENDAR_EVENT'],
      name: [data.event?.name || '', Validators.required],
      description: [data.event?.description || ''],
      course: [data.event?.courseId || null],
      start: [
        this.getRelevantDateInput(data.event?.start) || '',
        Validators.required,
      ],
      end: [
        this.getRelevantDateInput(data.event?.end) || '',
        Validators.required,
      ],
    });

    this.apiService
      .loadCourses()
      .subscribe((courses) => (this.courses = courses));
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const event = { ...this.eventForm.value, id: this.data.event?.id };
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      const name = event.name.trim();
      const description = event.description.trim();
      const courseId = event.course;
      const type = event.type;
      const completedSessions = this.data.event?.studyBlock?.completedSessions;
      const request = this.data.event
        ? this.apiService.updateEvent(
            type,
            event.id,
            name,
            description,
            startDate,
            endDate,
            courseId,
            completedSessions
          )
        : this.apiService.createEvent(
            type,
            name,
            description,
            startDate,
            endDate,
            courseId
          );

      request.subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error('Error saving event:', error),
      });
    }
  }

  getCurrentDate(): string {
    const date = new Date();
    return date.toLocaleString('sv');
  }

  getRelevantDateInput(date: Date | string): string {
    if (!date) {
      if (this.data.date) {
        return new Date(this.data.date).toLocaleString('sv').slice(0, 16);
      }
      return new Date().toLocaleString('sv').slice(0, 16);
    }
    const d = new Date(date);
    //Format as YYYY-MM-DDThh:mm
    return d.toLocaleString('sv').slice(0, 16);
  }
}
