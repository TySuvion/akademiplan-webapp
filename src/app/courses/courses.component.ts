import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Course, WeeklyGoal } from '../models/course.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WeeklyGoalsComponent } from '../weekly-goals/weekly-goals.component';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-courses',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    WeeklyGoalsComponent,
    MatDialogModule,
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
  courses: Course[] = [];

  showCourseForm = false;
  courseForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.courseForm = this.formBuilder.group({
      courseName: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.loadCourses();
  }

  openAddCourseDialog() {
    const dialogRef = this.dialog.open(CourseDialogComponent, { data: null });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCourses();
      }
    });
  }

  loadCourses() {
    this.apiService.loadCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log('Courses loaded successfully:', this.courses);
      },
    });
  }

  openCourseForm() {
    this.showCourseForm = true;
  }

  closeCourseForm() {
    this.showCourseForm = false;
    this.courseForm.reset();
  }

  deleteCourse(courseId: number) {
    this.apiService.deleteCourse(courseId).subscribe({
      next: () => {
        console.log('Course deleted successfully');
        this.loadCourses();
      },
      error: (error) => {
        console.error('Error deleting course:', error);
      },
    });
  }

  openEditCourseDialog(course: Course) {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      data: { course },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCourses();
      }
    });
  }
}
