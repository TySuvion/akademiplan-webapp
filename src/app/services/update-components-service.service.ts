import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateComponentsServiceService {
  private studySessionCompletedSubject =
    new BehaviorSubject<CalendarEvent | null>(null);
  studySessionCompleted$ = this.studySessionCompletedSubject.asObservable();

  private blockDeletedSubject = new BehaviorSubject<number | null>(null);
  blockDeleted$ = this.blockDeletedSubject.asObservable();

  notifyStudySessionCompleted(event: CalendarEvent | null) {
    this.studySessionCompletedSubject.next(event);
  }

  notifyBlockDeleted(blockId: number | null) {
    this.blockDeletedSubject.next(blockId);
  }
}
