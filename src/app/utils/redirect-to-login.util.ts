import { Router } from '@angular/router';

export function redirectToLogin(router: Router) {
  tryClearingStorage();
  router.navigate(['/login']);
}

function tryClearingStorage() {
  try {
    localStorage.clear();
  } catch (error) {
    return;
  }
}
