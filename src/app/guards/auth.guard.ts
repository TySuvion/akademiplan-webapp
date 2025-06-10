import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { redirectToLogin } from '../utils/redirect-to-login.util';
import { retry } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const token = getAccessToken();

  if (token) {
    const decodedToken: any = jwtDecode(token);
    return checkIfTokenIsExpiredAndRedirect(decodedToken);
  }
  redirectToLogin(inject(Router));
  return false;
};

function getAccessToken() {
  try {
    const token = localStorage.getItem('token');
    return token;
  } catch (error) {
    return null;
  }
}

function checkIfTokenIsExpiredAndRedirect(token: any): boolean {
  const isExpired = Date.now() >= token.exp * 1000;

  if (isExpired) {
    redirectToLogin(inject(Router));
    return false;
  }
  return true;
}
