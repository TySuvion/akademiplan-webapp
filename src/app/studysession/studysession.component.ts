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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-studysession',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MarkdownModule,
    MatDialogModule,
    CommonModule,
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

  private timerWorker: Worker;
  private timerSound = new Audio('assets/Timer_Complete.wav');
  private timerInterval: any;
  timeLeft: number = 25;
  isRunning: boolean = false;
  displayTime: string = '25:00';
  timerState: TimerState = TimerState.STUDY;

  constructor(private apiService: ApiService, private dialog: MatDialog) {
    this.timerWorker = new Worker(
      new URL('./studysession.worker', import.meta.url)
    );

    this.timerWorker.onmessage = ({ data }) => {
      switch (data.type) {
        case 'RUNNING':
          this.timeLeft = data.timeLeft;
          this.updateDisplayTime();
          break;
        case 'PAUSED':
          this.timeLeft = data.timeLeft;
          this.isRunning = false;
          break;
        case 'COMPLETE':
          this.timerSound
            .play()
            .catch((error) => console.error('Error Playing TimerSound', error));
          this.completedStudySession();
          break;
        case 'RESET':
          this.timeLeft = data.timeLeft;
          this.updateDisplayTime();
          break;
      }
    };
  }

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
          this.startTimer(5);
        },
        error: (error) => {
          console.error('Error completing study session:', error);
        },
      });
    }
    if (this.timerState == TimerState.BREAK) {
      this.stopTimerAndReset();
      this.timerState = TimerState.STUDY;
      this.startTimer(25);
    }
    if (this.isStudyBlockCompleted()) {
      const shouldContinue = await this.continueStudyingDialogOpen();
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

    this.isRunning = true;
    this.timerWorker.postMessage({
      type: 'START',
      minutes,
      state: this.timerState,
    });
  }

  pauseTimer() {
    this.timerWorker.postMessage({ type: 'PAUSE' });
    this.isRunning = false;
  }

  stopTimerAndReset() {
    this.timerWorker.postMessage({ type: 'STOP' });
    this.timerWorker.postMessage({ type: 'RESET' });
    this.isRunning = false;
    this.updateDisplayTime();
  }

  private updateDisplayTime() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.displayTime = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  ngOnDestroy() {
    this.timerWorker.terminate();
  }
}

enum TimerState {
  STUDY = 'STUDY',
  BREAK = 'BREAK',
}

if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker(new URL('./studysession.worker', import.meta.url));
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}
