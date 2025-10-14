

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RequestService } from '../servicves/request.service';


@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="employee-container">
      <h2>Submit Shift Request</h2>

      <form [formGroup]="shiftForm" (ngSubmit)="submitRequest()" class="request-form">
        <mat-form-field appearance="fill">
          <mat-label>Select Days</mat-label>
          <mat-select formControlName="requestedDays" multiple required>
            <mat-option *ngFor="let day of weekDays" [value]="day">{{ day }}</mat-option>
          </mat-select>
          <mat-error *ngIf="shiftForm.controls['requestedDays'].hasError('required')">
            Please select at least one day
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Select Shift</mat-label>
          <mat-select formControlName="shift" required>
            <mat-option *ngFor="let s of shifts" [value]="s">{{ s }}</mat-option>
          </mat-select>
          <mat-error *ngIf="shiftForm.controls['shift'].hasError('required')">
            Please select a shift
          </mat-error>
        </mat-form-field>

        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="shiftForm.invalid || loading"
        >
          Submit Request
        </button>
      </form>

      <div class="spinner-overlay" *ngIf="loading">
        <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
      </div>

      <h3>Your Submitted Requests</h3>

      <table mat-table [dataSource]="requests" class="mat-elevation-z8" *ngIf="!loading">
        <ng-container matColumnDef="days">
          <th mat-header-cell *matHeaderCellDef>Days</th>
          <td mat-cell *matCellDef="let r">{{ r.requestedDays.join(', ') }}</td>
        </ng-container>

        <ng-container matColumnDef="shift">
          <th mat-header-cell *matHeaderCellDef>Shift</th>
          <td mat-cell *matCellDef="let r">{{ r.shift }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let r">{{ r.status }}</td>
        </ng-container>

        <ng-container matColumnDef="comment">
          <th mat-header-cell *matHeaderCellDef>Admin Comment</th>
          <td mat-cell *matCellDef="let r">{{ r.adminComment || '-' }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>
    </div>
  `,
  styles: [`
    .employee-container {
      margin: 20px;
    }

    .request-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      max-width: 400px;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      margin-top: 10px;
    }

    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
  `]
})
export class EmployeeDashboardComponent implements OnInit {
  shiftForm!: FormGroup;

  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  shifts = ['7am - 3pm', '3pm - 11pm', '11pm - 7am'];
  requests: any[] = [];
  columns = ['days', 'shift', 'status', 'comment'];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private shiftService: RequestService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {

this.shiftForm = this.fb.group({
    requestedDays: [[], Validators.required],
    shift: ['', Validators.required]
  });

    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.shiftService.getRequestsByUser().subscribe({
      next: (res: any) => {
        this.requests = res;
        this.loading = false;
         
      },
      error: () => (this.loading = false)
    });
    
  }

  submitRequest() {
    if (this.shiftForm.invalid) return;
    this.loading = true;

    this.shiftService.submitRequest(this.shiftForm.value).subscribe({
      next: () => {
        this.snackbar.open('Shift request submitted successfully!', 'OK', { duration: 3000 });
        this.shiftForm.reset();
        this.loadRequests();
      },
      error: () => {
        this.snackbar.open('Failed to submit request.', 'Dismiss', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}

