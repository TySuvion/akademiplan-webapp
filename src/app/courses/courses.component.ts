import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Course } from '../models/course.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

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
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.courseForm = this.formBuilder.group({
      courseName: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.loadCourses();
  }

  addCourseAndReload() {
    if (this.courseForm.valid) {
      const courseName = this.courseForm.get('courseName')?.value;
      this.apiService.createCourse(courseName).subscribe({
        next: (course) => {
          console.log('Course added successfully:', course);
          this.loadCourses();
        },
        error: (error) => {
          console.error('Error adding course:', error);
        },
      });
      this.courseForm.reset();
      this.showCourseForm = false;
    }
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

  editCourse(courseId: number) {
    const newCourseName = prompt('Enter new course name:');
    if (!newCourseName) {
      return;
    }
    this.apiService.updateCourse(courseId, newCourseName).subscribe({
      next: () => {
        console.log('Course updated successfully');
        this.loadCourses();
      },
      error: (error) => {
        console.error('Error updating course:', error);
      },
    });
  }
}
