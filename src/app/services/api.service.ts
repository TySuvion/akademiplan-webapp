import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { CalendarEvent } from '../models/event.model';

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

  loadCourses(): Observable<Course[]> {
    const userId = this.getUserIdFromToken();
    return this.http.get<Course[]>(`${this.baseUrl}/courses/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  createCourse(course: string): Observable<Course> {
    const uId = this.getUserIdFromToken();
    return this.http.post<Course>(
      `${this.baseUrl}/courses`,
      { name: course, userId: uId },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
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

  updateCourse(courseId: number, courseName: string): Observable<Course> {
    return this.http.patch<Course>(
      `${this.baseUrl}/courses/${courseId}`,
      { name: courseName },
      {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      }
    );
  }

  deleteCourse(courseId: number): Observable<Course> {
    return this.http.delete<Course>(`${this.baseUrl}/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getEventsForDate(date: string): Observable<CalendarEvent[]> {
    const userId = this.getUserIdFromToken(); // Extract user ID from the token
    if (!userId) {
      throw new Error('User ID is missing from the token.');
    }
    return this.http.get<CalendarEvent[]>(
      `${this.baseUrl}/events/user/${userId}/${date}`,
      {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      }
    );
  }

  createEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${this.baseUrl}/events`, event);
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.patch<CalendarEvent>(
      `${this.baseUrl}/events/${event.id}`,
      event
    );
  }

  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/events/${eventId}`);
  }
}
