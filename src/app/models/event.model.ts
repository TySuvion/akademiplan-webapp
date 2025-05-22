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
  studyBlock?: StudyBlock;
}

export interface StudyBlock {
  id: number;
  eventId: number;
  plannedSessions: number;
  completedSessions: number;
}
