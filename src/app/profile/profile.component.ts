import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-profile',
  imports: [MatButtonModule, MatCardModule, MatToolbarModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  username: string = '';

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username')!;
    }
  }

  editUsername() {
    const newUsername = prompt('Enter new username:', this.username);
    if (newUsername) {
      this.apiService.editUsername(newUsername).subscribe({
        next: (response) => {
          console.log('Username updated successfully:', response);
          localStorage.setItem('username', newUsername);
          this.username = newUsername;
        },
        error: (error) => {
          console.error('Error updating username:', error);
        },
      });
    }
  }

  goToHome() {
    console.log('Go to Home');
    this.router.navigate(['/home']);
  }

  deleteUser() {
    this.apiService.deleteUser().subscribe({
      next: (response) => {
        console.log('User deleted successfully:', response);
        localStorage.clear();
        this.router.navigate(['/signup']);
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      },
    });
  }
}
