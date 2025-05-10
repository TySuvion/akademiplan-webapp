import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink,
    MatToolbarModule,
  ],
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    console.log('ApiService: ', this.apiService);
    this.signupForm = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(15),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { username, password } = this.signupForm.value;
      this.apiService.signUp(username, password).subscribe({
        next: (response) => {
          console.log('User signed up successfully:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage =
            'Ein Fehler ist aufgetreten. Nutzername möglicherweise bereits vergeben.';
          console.error('Error signing up:', error);
        },
      });
    }
  }
}
