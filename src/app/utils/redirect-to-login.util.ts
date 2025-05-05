import { Router } from '@angular/router';

export function redirectToLogin(router: Router) {
  localStorage.clear();
  console.log('Redirecting to login');
  router.navigate(['/login']);
}
