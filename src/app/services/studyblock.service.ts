import { Injectable } from '@angular/core';
import { start } from 'repl';

@Injectable({
  providedIn: 'root',
})
export class StudyblockService {
  constructor() {}

  calculatePlannedSessions(startTime: Date, endTime: Date): number {
    const differenceInMinutes =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60); // Convert milliseconds to minutes
    const plannedSessions = Math.floor(differenceInMinutes / 30); //each session is 30 minutes 25 work + 5 break
    return plannedSessions;
  }
}
