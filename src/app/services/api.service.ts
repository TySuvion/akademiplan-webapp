import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course, WeeklyGoal } from '../models/course.model';
import { CalendarEvent, StudyBlock } from '../models/event.model';
import { StudyblockService } from './studyblock.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';
  constructor(
    private http: HttpClient,
    private studyblockService: StudyblockService
  ) {}

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

  getCourseById(courseId: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  loadCourses(): Observable<Course[]> {
    const userId = this.getUserIdFromToken();
    return this.http.get<Course[]>(`${this.baseUrl}/courses/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  createCourse(course: string, plannedSessions?: number): Observable<Course> {
    const uId = this.getUserIdFromToken();
    const payload: any = { name: course, userId: uId };
    if (plannedSessions !== undefined) {
      payload.sessionGoal = plannedSessions;
    }
    return this.http.post<Course>(`${this.baseUrl}/courses`, payload, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
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

  updateCourse(
    courseId: number,
    courseName: string,
    plannedSession?: number
  ): Observable<Course> {
    let payload: any = { name: courseName };
    if (plannedSession) {
      payload.sessionGoal = plannedSession;
    }
    console.log('update course payload: ', payload);
    return this.http.patch<Course>(
      `${this.baseUrl}/courses/${courseId}`,
      payload,
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

  createEvent(
    type: string,
    name: string,
    description: string,
    start: Date,
    end: Date,
    courseId?: number | null
  ): Observable<CalendarEvent> {
    const uId = this.getUserIdFromToken();
    const plannedSessions = this.studyblockService.calculatePlannedSessions(
      start,
      end
    );
    if (type == 'STUDY_BLOCK') {
      return this.http.post<CalendarEvent>(
        `${this.baseUrl}/events/studyblock`,
        {
          name: name,
          description: description,
          start: start.toISOString(),
          end: end.toISOString(),
          courseId: courseId,
          userId: uId,
          plannedSessions: plannedSessions,
          completedSessions: 0,
        }
      );
    }
    return this.http.post<CalendarEvent>(`${this.baseUrl}/events`, {
      name: name,
      description: description,
      start: start.toISOString(),
      end: end.toISOString(),
      courseId: courseId,
      userId: uId,
    });
  }

  updateEvent(
    type: string,
    eventId: number,
    name: string,
    description: string,
    start: Date,
    end: Date,
    courseId?: number | null,
    completedSessions?: number | null
  ): Observable<CalendarEvent> {
    if (type == 'STUDY_BLOCK') {
      const plannedSessions = this.studyblockService.calculatePlannedSessions(
        start,
        end
      );

      return this.http.patch<CalendarEvent>(
        `${this.baseUrl}/events/studyblock/${eventId}`,
        {
          name: name,
          description: description,
          start: start.toISOString(),
          end: end.toISOString(),
          courseId: courseId,
          plannedSessions: plannedSessions,
          completedSessions: completedSessions,
        }
      );
    }
    return this.http.patch<CalendarEvent>(`${this.baseUrl}/events/${eventId}`, {
      name: name,
      description: description,
      start: start.toISOString(),
      end: end.toISOString(),
      courseId: courseId,
    });
  }

  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/events/${eventId}`);
  }

  completeStudySession(event: CalendarEvent): Observable<CalendarEvent> {
    console.log(event);
    if (!event.studyBlock) {
      throw new Error('Event does not have a study block associated with it.');
    }
    return this.http.patch<CalendarEvent>(
      `${this.baseUrl}/events/studyblock/${event.id}`,
      {
        plannedSessions: event.studyBlock.plannedSessions, // Keep planned sessions the same
        completedSessions: event.studyBlock?.completedSessions + 1,
      }
    );
  }

  createWeeklyGoal(
    courseId: number,
    plannedSessions: number
  ): Observable<WeeklyGoal> {
    return this.http.post<WeeklyGoal>(`${this.baseUrl}/courses/weeklygoal`, {
      courseId: courseId,
      goalSessions: plannedSessions,
      completedSessions: 0,
    });
  }

  updateGoalProgress(goal: WeeklyGoal): Observable<WeeklyGoal> {
    return this.http.patch<WeeklyGoal>(
      `${this.baseUrl}/courses/weeklygoal/${goal.id}`,
      {} //progress updates automatically in backend
    );
  }

  getAllStudyblocksUntilToday(): Observable<CalendarEvent[]> {
    let userId = this.getUserIdFromToken();
    return this.http.get<CalendarEvent[]>(
      `${this.baseUrl}/events/untilToday/${userId}`
    ); //TODO hier weitermachen
  }
}
