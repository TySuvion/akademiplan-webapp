import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api.service';
import { WeeklyGoal } from '../../models/course.model';

@Component({
  selector: 'app-course-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './course-dialog.component.html',
  styleUrl: './course-dialog.component.css',
})
export class CourseDialogComponent {
  courseForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.courseForm = this.formBuilder.group({
      name: [data.course?.name || 'Neuer Kurs', Validators.required],
      addWeekyGoal: [this.hasCurrentWeeklyGoal()],
      plannedSessions: [data.course?.plannedSessions || 0],
    });
  }

  hasCurrentWeeklyGoal(): boolean {
    if (this.data.course?.weeklyGoals) {
      const today = new Date();

      this.data.course.weeklyGoals.forEach((goal: WeeklyGoal) => {
        const weekStart = new Date(goal.weekStart);
        const weekEnd = new Date(goal.weekEnd);
        if (today >= weekStart && today <= weekEnd) {
          return true;
        }
      });
    }
    return false;
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const courseFormResults = {
        ...this.courseForm.value,
      };

      let id = this.data.course?.id;

      const name = courseFormResults.name.trim();
      const request = this.data.course
        ? this.apiService.updateCourse(this.data.course.id, name)
        : this.apiService.createCourse(name);

      request.subscribe({
        next: (course) => {
          id = course.id;
          if (courseFormResults.addWeeklyGoal) {
            //TODO continue here.
          }
        },
        error: (error) => console.error('Error saving event: ', error),
      });
    }
  }
}
