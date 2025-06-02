import { CalendarEvent } from './event.model';

export interface Course {
  id: number;
  name: string;
  userId: number;
  events: CalendarEvent[];
  weeklyGoals: WeeklyGoal[];
}

export interface WeeklyGoal {
  id: number;
  courseId: number;
  weekStart: Date;
  weekEnd: Date;
  goalSessions: number;
  completedSessions: number;
}
