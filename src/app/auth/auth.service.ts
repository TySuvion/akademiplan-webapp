import { Injectable } from '@angular/core';
import { environment } from '../../environments/env.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  signUp(username: string, password: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/auth/signup`,
      { username: username, password: password },
      { observe: 'response' }
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/auth/login`,
      { username: username, password: password },
      { observe: 'response' }
    );
  }

  logout() {
    console.log('User logged out');
    localStorage.clear();
  }

  saveToken(token: string): Promise<void> {
    return new Promise((resolve) => {
      localStorage.setItem('token', token);
      resolve;
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }
}
