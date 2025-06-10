import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { redirectToLogin } from '../utils/redirect-to-login.util';

export const authGuard: CanActivateFn = (route, state) => {
  try {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const isExpired = Date.now() >= decodedToken.exp * 1000;

        if (isExpired) {
          redirectToLogin(inject(Router));
          return false;
        }
        return true;
      } catch (error) {
        redirectToLogin(inject(Router));
        return false;
      }
    }
    redirectToLogin(inject(Router));
    return false;
  } catch (error) {
    redirectToLogin(inject(Router));
    return false;
  }
};
