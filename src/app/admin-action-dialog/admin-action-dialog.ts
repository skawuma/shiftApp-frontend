import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-action-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.action | titlecase }} Request</h2>
    <form [formGroup]="form" (ngSubmit)="confirm()" class="dialog-form">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Comment (optional)</mat-label>
        <textarea matInput formControlName="comment" rows="3"></textarea>
      </mat-form-field>

      <div class="buttons">
        <button mat-button type="button" (click)="cancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit">
          {{ data.action | titlecase }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 10px;
    }
    .full-width {
      width: 100%;
    }
    .buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `]
})
export class AdminActionDialog implements OnInit {



  form!: FormGroup

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdminActionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


    ngOnInit() {
  this.form = this.fb.group({
    comment: ['']
  });

    }
  confirm() {
    this.dialogRef.close(this.form.value.comment);
  }

  cancel() {
    this.dialogRef.close();
  }
}
