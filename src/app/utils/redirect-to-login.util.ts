import { Router } from '@angular/router';

export function redirectToLogin(router: Router) {
  try {
    localStorage.clear();
    router.navigate(['/login']);
  } catch (error) {
    router.navigate(['/login']);
  }
}
