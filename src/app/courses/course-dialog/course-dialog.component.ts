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
import { Course, WeeklyGoal } from '../../models/course.model';

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

  isEditMode: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.isEditMode = !!data?.course;
    this.courseForm = this.formBuilder.group({
      name: [
        this.isEditMode ? data.course.name : 'Neuer Kurs',
        Validators.required,
      ],
      addWeekyGoal: [false],
      plannedSessions: [0],
    });

    if (this.isEditMode) {
      this.courseForm.patchValue({
        addWeekyGoal: this.hasCurrentWeeklyGoal(),
        plannedSessions: this.getCurrentWeeksPlannedSessions(data.course),
      });
    }
  }

  getCurrentWeeksPlannedSessions(course: Course): number {
    if (!this.data?.course?.weeklyGoals) {
      return 0;
    }

    const currentWeekGoal = this.data?.course.weeklyGoals.find(
      (goal: WeeklyGoal) => this.goalIsInCurrentWeek(goal)
    );

    return currentWeekGoal?.goalSessions || 0;
  }

  hasCurrentWeeklyGoal(): boolean {
    return (
      this.data?.course?.weeklyGoals?.some((goal: WeeklyGoal) =>
        this.goalIsInCurrentWeek(goal)
      ) ?? false
    );
  }

  goalIsInCurrentWeek(goal: WeeklyGoal): boolean {
    const today = new Date();
    const weekStart = new Date(goal.weekStart);
    const weekEnd = new Date(goal.weekEnd);
    if (today >= weekStart && today <= weekEnd) {
      return true;
    } else return false;
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const courseFormResults = {
        ...this.courseForm.value,
      };

      let id = this.data?.course?.id;

      const name = courseFormResults.name.trim();
      const request = this.data?.course
        ? this.apiService.updateCourse(
            id,
            name,
            courseFormResults.plannedSessions
          )
        : this.apiService.createCourse(name, courseFormResults.plannedSessions);

      request.subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error('Error saving course: ', error),
      });
    }
  }
}
