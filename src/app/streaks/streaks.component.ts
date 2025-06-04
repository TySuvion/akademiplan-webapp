import { Component } from '@angular/core';

@Component({
  selector: 'app-streaks',
  imports: [],
  templateUrl: './streaks.component.html',
  styleUrl: './streaks.component.css',
})
export class StreaksComponent {
  //Everyday that a Session was planned and completed the streak will go up
  //If there is a day with
  currentStreak: number = 0;

  setStreak() {
    //get a list with all the events up until today where sessions where planned
    //if a session was completed on that day streak will go up by one.
    // if no session was completed streak will reset.
    // if no sessions were planned to changes to the streak should be made
  }

  updateStreak() {}

  resetStreak() {}
}
