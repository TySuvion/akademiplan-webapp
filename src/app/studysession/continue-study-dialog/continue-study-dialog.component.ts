import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-continue-study-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './continue-study-dialog.component.html',
  styleUrl: './continue-study-dialog.component.css',
})
export class ContinueStudyDialogComponent {
  @Output() continueStudy: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private dialogRef: MatDialogRef<ContinueStudyDialogComponent>) {}

  onContinue() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
