import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  username: string = 'Tyler';
  router = new Router();

  editUsername() {
    console.log('Changed Username to {{this.username}}');
  }

  goToHome() {
    console.log('Go to Home');
    this.router.navigate(['/home']);
  }
}
