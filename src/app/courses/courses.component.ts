import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
  @Input() courses: string[] = [];
  @Output() courseAdded = new EventEmitter<string>();

  showCourseForm = false;
  courseForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.courseForm = this.formBuilder.group({
      courseName: ['', Validators.required, Validators.minLength(3)],
    });
  }

  addCourse() {
    if (this.courseForm.valid) {
      const courseName = this.courseForm.get('courseName')?.value;
      this.courseAdded.emit(courseName);
      this.courseForm.reset();
      this.showCourseForm = false;
    }
  }

  openCourseForm() {
    this.showCourseForm = true;
  }

  closeCourseForm() {
    this.showCourseForm = false;
    this.courseForm.reset();
  }
}
