import { Component, Input, OnInit } from '@angular/core';
import { Course, WeeklyGoal } from '../models/course.model';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weekly-goals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weekly-goals.component.html',
  styleUrl: './weekly-goals.component.css',
})
export class WeeklyGoalsComponent implements OnInit {
  @Input({ required: true }) course!: Course;
  currentWeeklyGoal: WeeklyGoal | undefined;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.setCurrentWeeksGoal();
    this.updateGoalProgress();
  }

  setCurrentWeeksGoal() {
    const today = new Date();
    this.currentWeeklyGoal = this.course.weeklyGoals.find((goal) => {
      const weekStart = new Date(goal.weekStart);
      const weekEnd = new Date(goal.weekEnd);
      return today >= weekStart && today <= weekEnd;
    });
  }

  displayCurrentWeeklyGoal(): string {
    if (this.currentWeeklyGoal === undefined) {
      return '';
    }
    console.log('Current Weekly Goal:', this.currentWeeklyGoal);
    let goalString = '';
    const plannedSessions = this.currentWeeklyGoal.goalSessions;
    const completedSessions = this.currentWeeklyGoal.completedSessions;
    for (let i = 0; i < plannedSessions; i++) {
      if (i < completedSessions) {
        goalString += '🟩 ';
      } else {
        goalString += '⬜️ ';
      }
    }
    return goalString.trim();
  }

  updateGoalProgress() {
    console.log('updating goal progress ...');
    if (this.currentWeeklyGoal === undefined) {
      return;
    }
    this.apiService.updateGoalProgress(this.currentWeeklyGoal).subscribe({
      next: (updatedGoal) => {
        console.log('Goal progress updated:', updatedGoal);
      },
      error: (error) => {
        console.error('Error updating goal progress:', error);
      },
    });
  }
}
