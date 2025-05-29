import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarEvent } from '../models/event.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StudyblockService } from '../services/studyblock.service';
import { ApiService } from '../services/api.service';
import { MarkdownModule } from 'ngx-markdown';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContinueStudyDialogComponent } from './continue-study-dialog/continue-study-dialog.component';

@Component({
  selector: 'app-studysession',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MarkdownModule,
    ContinueStudyDialogComponent,
    MatDialogModule,
  ],
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
  @Output() sessionCompleted = new EventEmitter<CalendarEvent>();
  @Output() studyBlockEnded = new EventEmitter<void>();

  private timerInterval: any;
  timeLeft: number = 25;
  isRunning: boolean = false;
  displayTime: string = '25:00';
  timerState: TimerState = TimerState.STUDY;

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  stopStudying() {
    this.studyBlockEnded.emit();
  }

  continueStudyingDialogOpen(): Promise<boolean> {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(ContinueStudyDialogComponent, {
        width: '300px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        resolve(!!result);
      });
    });
  }

  async completedStudySession() {
    if (this.timerState == TimerState.STUDY) {
      this.apiService.completeStudySession(this.studyBlockEvent).subscribe({
        next: (response) => {
          this.studyBlockEvent.studyBlock!.completedSessions++;
          this.sessionCompleted.emit(this.studyBlockEvent);
          this.stopTimerAndReset();
          this.timerState = TimerState.BREAK;
          this.startTimer(5); // Start a 5-minute break timer
        },
        error: (error) => {
          console.error('Error completing study session:', error);
          // Handle error appropriately, e.g., show a notification
        },
      });
    }
    if (this.timerState == TimerState.BREAK) {
      this.stopTimerAndReset();
      this.timerState = TimerState.STUDY;
      this.startTimer(25); // Start a 25-minute study timer
    }
    if (this.isStudyBlockCompleted()) {
      const shouldContinue = await this.continueStudyingDialogOpen();
      console.log(shouldContinue);
      if (shouldContinue) {
        return;
      } else {
        this.stopStudying();
        return;
      }
    }
  }

  isStudyBlockCompleted(): boolean {
    return (
      this.studyBlockEvent.studyBlock?.completedSessions! >=
      this.studyBlockEvent.studyBlock?.plannedSessions!
    );
  }

  getCurrentSession() {
    if (!this.studyBlockEvent.studyBlock) {
      return 1;
    }
    return this.studyBlockEvent.studyBlock?.completedSessions + 1;
  }

  toggleStudyTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer(this.timeLeft);
    }
  }

  startTimer(minutes: number) {
    if (this.isRunning) return;

    this.timeLeft = minutes * 60;
    this.isRunning = true;

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateDisplayTime();
      } else {
        this.timerComplete();
      }
    }, 1000);
  }

  pauseTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.isRunning = false;
      this.timeLeft = this.timeLeft / 60;
    }
  }

  stopTimerAndReset() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.isRunning = false;
      this.updateDisplayTime();
    }
  }

  private updateDisplayTime() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.displayTime = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  private timerComplete() {
    this.stopTimerAndReset();
    this.sessionCompleted.emit(this.studyBlockEvent);
    // You might want to play a sound or show a notification here
  }

  ngOnDestroy() {
    this.pauseTimer();
  }
}

enum TimerState {
  STUDY = 'STUDY',
  BREAK = 'BREAK',
}
