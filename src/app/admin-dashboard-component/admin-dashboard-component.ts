
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RequestService } from '../servicves/request.service';
import { AdminActionDialog } from '../admin-action-dialog/admin-action-dialog';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="admin-container">
      <h2>Admin Shift Request Management</h2>

      <div class="filter-row">
        <mat-form-field appearance="fill">
          <mat-label>Filter by Status</mat-label>
          <mat-select [(value)]="selectedStatus" (selectionChange)="loadRequests()">
            <mat-option value="">All</mat-option>
            <mat-option value="PENDING">Pending</mat-option>
            <mat-option value="APPROVED">Approved</mat-option>
            <mat-option value="REJECTED">Rejected</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div *ngIf="loading" class="spinner-overlay">
        <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
      </div>

      <table mat-table [dataSource]="requests" class="mat-elevation-z8" *ngIf="!loading">
        <ng-container matColumnDef="employee">
          <th mat-header-cell *matHeaderCellDef>Employee ID</th>
          <td mat-cell *matCellDef="let r">{{ r.employeeId }}</td>
        </ng-container>

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

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let r">
            <button
              mat-raised-button
              color="primary"
              (click)="openActionDialog(r, 'approve')"
              [disabled]="r.status !== 'PENDING'"
            >
              Approve
            </button>
            <button
              mat-raised-button
              color="warn"
              (click)="openActionDialog(r, 'reject')"
              [disabled]="r.status !== 'PENDING'"
            >
              Reject
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>

      <mat-paginator
        [length]="totalElements"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 20]"
        (page)="onPageChange($event)"
      ></mat-paginator>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
    }

    .filter-row {
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      margin-bottom: 10px;
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
export class AdminDashboardComponent implements OnInit {
  private shiftService = inject(RequestService);
  private snackbar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  requests: any[] = [];
  columns = ['employee', 'days', 'shift', 'status', 'actions'];
  selectedStatus = '';
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;
  loading = false;

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.shiftService.getAllRequests(this.pageIndex, this.pageSize, this.selectedStatus).subscribe({
      next: (res: any) => {
        this.requests = res.content || res; // works with pageable or array
        this.totalElements = res.totalElements || this.requests.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackbar.open('Failed to load requests', 'Dismiss', { duration: 3000 });
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRequests();
  }

  openActionDialog(request: any, action: 'approve' | 'reject') {
    const dialogRef = this.dialog.open(AdminActionDialog, {
      width: '400px',
      data: { request, action }
    });

    dialogRef.afterClosed().subscribe((comment) => {
      if (comment !== undefined) {
        this.loading = true;
        const call =
          action === 'approve'
            ? this.shiftService.approveRequest(request.id, comment)
            : this.shiftService.rejectRequest(request.id, comment);

        call.subscribe({
          next: () => {
            this.snackbar.open(`Request ${action}d successfully`, 'OK', { duration: 3000 });
            this.loadRequests();
          },
          error: () => {
            this.snackbar.open(`Failed to ${action} request`, 'Dismiss', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }
}
