import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarEvent } from '../models/event.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-studysession',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './studysession.component.html',
  styleUrl: './studysession.component.css',
})
export class StudysessionComponent {
  @Input() studyBlockEvent: CalendarEvent = {
    id: 0,
    name: 'Test',
    description: '',
    start: new Date(),
    end: new Date(),
    courseId: 0,
    type: 'STUDY_BLOCK',
    userId: 0,
    studyBlock: {
      id: 0,
      eventId: 0,
      plannedSessions: 0,
      completedSessions: 0,
    },
  };
  @Output() sessionCompleted = new EventEmitter<void>();
  @Output() studyBlockEnded = new EventEmitter<void>();

  startTimer() {}

  stopTimer() {}

  stopStudying() {
    this.studyBlockEnded.emit();
  }

  completedStudySession() {
    //TODO Updated Session count.
  }

  getCurrentSession() {
    if (!this.studyBlockEvent.studyBlock) {
      return 1;
    }
    return this.studyBlockEvent.studyBlock?.completedSessions + 1;
  }
}
