import { Course } from './course.model';

export interface CalendarEvent {
  id: number;
  name: string;
  description: string;
  start: Date;
  end: Date;
  courseId: number;
  userId: number;
  course?: Course;
  type?: string;
  plannedSessions?: number;
  completedSessions?: number;
}
