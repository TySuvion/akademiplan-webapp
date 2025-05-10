import { Component, Input } from '@angular/core';
import { CalendarEvent } from '../models/event.model';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  @Input() selectedDate: Date = new Date();
  calendarEvents: CalendarEvent[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    //TODO load Events
  }

  editEvent(eventId: number) {
    //TODO implement
  }

  deleteEvent(eventId: number) {}
}
