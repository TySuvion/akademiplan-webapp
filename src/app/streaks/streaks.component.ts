import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CalendarEvent } from '../models/event.model';

@Component({
  selector: 'app-streaks',
  imports: [],
  templateUrl: './streaks.component.html',
  styleUrl: './streaks.component.css',
})
export class StreaksComponent implements OnInit, OnChanges {
  //Everyday that a Session was planned and completed the streak will go up
  //If there is a day with
  currentStreak: number = 0;
  events: CalendarEvent[] = [];
  days: Date[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.setStreak();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  setStreak() {
    //get a list with all the events up until today where sessions where planned
    this.apiService.getAllStudyblocksUntilToday().subscribe({
      next: (studyblockEvents) => {
        studyblockEvents.forEach((event) => {
          event.start = new Date(event.start);
          event.start.setHours(0, 0, 0, 0);
        });
        this.events = studyblockEvents;
        this.createAListOfDateUntilYesterday();
        this.days.forEach((date) => {
          const block = this.events.find((event) => {
            const start = new Date(event.start).toISOString();
            const day = new Date(date).toISOString();
            return start == day;
          });
          if (block) {
            if (block.studyBlock?.completedSessions! > 0) {
              this.increaseStreak();
            } else {
              this.resetStreak();
            }
          }
        });
        this.checkProgressForToday();
      },
      error: (error) =>
        console.error('Error getting all Events for Streak: ', error),
    });
  }

  createAListOfDateUntilYesterday() {
    if (this.events.length === 0) return;
    const firstDate = new Date(this.events[0].start);
    const today = new Date();
    let daysList: Date[] = [];
    let currentDate = new Date(firstDate);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate < today) {
      daysList.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.days = daysList;
  }

  checkProgressForToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const block = this.events.find((event) => {
      event.start == today;
    });
    if (block) {
      if (block.studyBlock?.completedSessions! > 0) {
        this.increaseStreak();
      }
    }
  }

  increaseStreak() {
    this.currentStreak += 1;
  }

  resetStreak() {
    this.currentStreak = 0;
  }
}
