import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showPassword = false;
  showConfirmPassword = false;
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      console.log(`Login with: ${username} and ${password}`);
      this.apiService.login(username, password).subscribe({
        next: (response) => {
          console.log('User logged in successfully:', response);
          this.apiService.saveToken(response.body.accessToken);
          localStorage.setItem('username', username);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error logging in:', error);
        },
      });
    }
  }
}
