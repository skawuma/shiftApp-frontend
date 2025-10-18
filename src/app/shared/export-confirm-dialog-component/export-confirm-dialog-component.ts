import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-export-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Export Selected?</h2>
    <div mat-dialog-content>
      <p>You have selected {{ data.count }} requests. Do you want to export only those?</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close('cancel')">Cancel</button>
      <button mat-button (click)="dialogRef.close('all')">Export All</button>
      <button mat-raised-button color="primary" (click)="dialogRef.close('selected')">
        Export Selected
      </button>
    </div>
  `
})
export class ExportConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ExportConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { count: number }
  ) {}
}