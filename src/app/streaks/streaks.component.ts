import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CalendarEvent } from '../models/event.model';
import { UpdateComponentsServiceService } from '../services/update-components-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-streaks',
  imports: [],
  templateUrl: './streaks.component.html',
  styleUrl: './streaks.component.css',
})
export class StreaksComponent implements OnInit, OnDestroy {
  //Everyday that a Session was planned and completed the streak will go up
  //If there is a day with
  currentStreak: number = 0;
  events: CalendarEvent[] = [];
  days: Date[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private apiService: ApiService,
    private updateComponentsService: UpdateComponentsServiceService
  ) {
    this.subscriptions.push(
      this.updateComponentsService.studySessionCompleted$.subscribe((event) => {
        this.setStreak();
      })
    );

    this.subscriptions.push(
      this.updateComponentsService.blockDeleted$.subscribe((blockId) => {
        this.setStreak();
      })
    );
  }

  ngOnInit(): void {
    this.setStreak();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  setStreak() {
    this.apiService.getAllStudyblocksUntilToday().subscribe({
      next: (studyblockEvents) => {
        // Reset streak at start
        this.currentStreak = 0;

        // Normalize dates
        studyblockEvents.forEach((event) => {
          event.start = new Date(event.start);
          event.start.setHours(0, 0, 0, 0);
        });

        this.events = studyblockEvents;
        this.createAListOfDateUntilYesterday();

        // Track consecutive successful days
        let consecutiveDays = 0;

        this.days.forEach((date) => {
          //check if they are any studyblocks planned on each date
          const block = this.events.find(
            (event) => event.start.getTime() === date.getTime()
          );
          //only if a block exists will the consectiveDays be counted or reset
          if (block) {
            if (block?.studyBlock?.completedSessions! > 0) {
              consecutiveDays++;
            } else {
              consecutiveDays = 0;
            }
          }

          this.currentStreak = consecutiveDays;
        });

        // Check today separately
        this.checkProgressForToday();
      },
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
