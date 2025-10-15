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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RequestService } from '../servicves/request.service';
import { MatIcon } from '@angular/material/icon';
import { Auth } from '../servicves/auth';

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
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIcon,
    
  ],
  template: `
  

    <div class="employee-container">
     <h2 class="welcome-header">Welcome back, {{ username }} 👋🏽</h2>

      <form [formGroup]="shiftForm" (ngSubmit)="submitRequest()" class="request-form">
        <!-- MULTI-DATE PICKER -->
        <mat-form-field appearance="fill">
          <mat-label>Select Dates</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            (dateChange)="toggleDate($event.value)"
            placeholder="Pick one or more dates"
          />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <div class="selected-dates" *ngIf="selectedDates.length > 0">
            <span *ngFor="let d of selectedDates" class="date-chip">
              {{ d | date: 'mediumDate' }}
              <button mat-icon-button color="warn" (click)="removeDate(d)">
                <mat-icon>close</mat-icon>
              </button>
            </span>
          </div>
          <mat-error *ngIf="selectedDates.length === 0">
            Please select at least one date
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
          [disabled]="selectedDates.length === 0 || shiftForm.invalid || loading"
        >
          Submit Request
        </button>
      </form>

      <div class="spinner-overlay" *ngIf="loading">
        <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
      </div>

      <h3>Your Submitted Requests</h3>

      <table mat-table [dataSource]="requests" class="mat-elevation-z8" *ngIf="!loading">
        <ng-container matColumnDef="dates">
          <th mat-header-cell *matHeaderCellDef>Dates</th>
          <td mat-cell *matCellDef="let r">{{ r.requestedDates.join(', ') }}</td>
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
    .welcome-header {
  font-weight: 600;
  margin-bottom: 12px;
  color: #2e7d32;
}


    .request-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      max-width: 500px;
      margin-bottom: 20px;
    }

    .selected-dates {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 5px;
    }

    .date-chip {
      background: #e3f2fd;
      padding: 5px 8px;
      border-radius: 20px;
      display: flex;
      align-items: center;
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
  selectedDates: Date[] = [];
  shifts = ['7am - 3pm', '3pm - 11pm', '11pm - 7am'];
  requests: any[] = [];
  columns = ['dates', 'shift', 'status', 'comment'];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private shiftService: RequestService,
    private snackbar: MatSnackBar,
    private auth:Auth
  ) {}
    username = localStorage.getItem('shift-app-username');

  ngOnInit() {
    this.shiftForm = this.fb.group({
      shift: ['', Validators.required]
    });
    this.loadRequests();
  }

  toggleDate(date: Date) {
    if (!date) return;
    const idx = this.selectedDates.findIndex(
      d => d.toDateString() === date.toDateString()
    );
    if (idx >= 0) this.selectedDates.splice(idx, 1);
    else this.selectedDates.push(date);
  }

  removeDate(date: Date) {
    this.selectedDates = this.selectedDates.filter(
      d => d.toDateString() !== date.toDateString()
    );
  }
  logoutConfirm() {
    const confirmed = confirm(`Are you sure you want to log out, ${this.username}?`);
    if (confirmed) {
      this.auth.logout();
      this.snackbar.open(`Goodbye, ${this.username} 👋🏽`, 'OK', { duration: 3000 });
    }
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
    if (this.shiftForm.invalid || this.selectedDates.length === 0) return;
    this.loading = true;

    const payload = {
      userId: 1, // replace with logged-in user id
      requestedDates: this.selectedDates.map(d => this.formatDate(d)),
      shift: this.shiftForm.value.shift
    };

    this.shiftService.submitRequest(payload).subscribe({
      next: () => {
        this.snackbar.open('Shift request submitted successfully!', 'OK', { duration: 3000 });
        this.shiftForm.reset();
        this.selectedDates = [];
        this.loadRequests();
      },
      error: (err) => {
        this.snackbar.open('Failed to submit request: ' + (err?.error?.message || ''), 'Dismiss', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
