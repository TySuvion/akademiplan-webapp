import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  username: string = '';
  router = new Router();

  ngOnInit() {
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username')!;
    }
  }

  editUsername() {
    console.log('Changed Username to {{this.username}}');
  }

  goToHome() {
    console.log('Go to Home');
    this.router.navigate(['/home']);
  }
}
