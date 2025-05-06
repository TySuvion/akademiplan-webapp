import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
  courses: string[] = [];

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
      this.apiService.saveCourse(courseName).subscribe({
        next: (response) => {
          console.log('Course added successfully:', response);
        },
        error: (error) => {
          console.error('Error adding course:', error);
        },
      });
      this.loadCourses();
      this.courseForm.reset();
      this.showCourseForm = false;
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

  openCourseForm() {
    this.showCourseForm = true;
  }

  closeCourseForm() {
    this.showCourseForm = false;
    this.courseForm.reset();
  }

  deleteCourse(courseId: number) {
    //TODO: Implement delete course functionality
  }

  editCourse(courseId: number) {
    //TODO: Implement edit course functionality
  }
}
