import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  signUp(username: string, password: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/users`,
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

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }

  loadCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
      observe: 'response',
    });
  }

  saveCourse(course: string): Observable<any> {
    console.log('User ID got from token: ' + this.getUserIdFromToken());
    return this.http.post(
      `${this.baseUrl}/courses`,
      { name: course },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
        observe: 'response',
      }
    );
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);
      return parsedPayload.userId;
    } catch (e) {
      return null;
    }
  }
}
