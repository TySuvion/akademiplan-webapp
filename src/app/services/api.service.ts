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
    const userId = this.getUserIdFromToken();
    return this.http.get(`${this.baseUrl}/courses/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
      observe: 'response',
    });
  }

  saveCourse(course: string): Observable<any> {
    const uId = this.getUserIdFromToken();
    return this.http.post(
      `${this.baseUrl}/courses`,
      { name: course, userId: uId },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
        observe: 'response',
      }
    );
  }

  deleteUser(): Observable<any> {
    const userId = this.getUserIdFromToken();
    return this.http.delete(`${this.baseUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
      observe: 'response',
    });
  }

  editUsername(newUsername: string): Observable<any> {
    const userId = this.getUserIdFromToken();
    return this.http.patch(
      `${this.baseUrl}/users/${userId}`,
      { username: newUsername },
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
      return parsedPayload.id;
    } catch (e) {
      return null;
    }
  }
}
