export interface CalendarEvent {
  id: number;
  name: string;
  description: string;
  start: Date;
  end: Date;
  courseId: number;
  userId: number;
}
