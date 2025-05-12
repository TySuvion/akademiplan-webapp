import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
})
export class EventDialogComponent {
  eventForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.eventForm = this.formBuilder.group({
      name: [data.event?.name || '', Validators.required],
      description: [data.event?.description || ''],
      start: [data.event?.start || '', Validators.required],
      end: [data.event?.end || '', Validators.required],
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const event = { ...this.eventForm.value, id: this.data.event?.id };
      const request = this.data.event
        ? this.apiService.updateEvent(event)
        : this.apiService.createEvent(event);

      request.subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error('Error saving event:', error),
      });
    }
  }
}
