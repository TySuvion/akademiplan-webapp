import { Router } from '@angular/router';

export function redirectToLogin(router: Router) {
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token');
  }
  if (localStorage.getItem('username')) {
    localStorage.removeItem('username');
  }
  console.log('Redirecting to login');
  router.navigate(['/login']);
}
