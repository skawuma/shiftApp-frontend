import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { RequestService } from '../servicves/request.service';
import { AdminActionDialog } from '../admin-action-dialog/admin-action-dialog';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ExportConfirmDialogComponent } from '../shared/export-confirm-dialog-component/export-confirm-dialog-component';

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
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ExportConfirmDialogComponent,
    FormsModule,
    MatCheckboxModule
],
  animations: [
    trigger('rowFade', [
      state('visible', style({ opacity: 1, transform: 'scale(1)' })),
      state('hidden', style({ opacity: 0, transform: 'scale(0.95)' })),
      transition('hidden => visible', animate('300ms ease-in')),
    ])
  ],
  template: `
    <div class="admin-container">
      <h2>Admin Shift Request Management</h2>

      <!-- Export Buttons -->
      <div class="export-row">
        <button mat-raised-button color="primary" (click)="exportToCSV()">Export to CSV</button>
        <button mat-raised-button color="accent" (click)="exportToExcel()">Export to Excel</button>
      </div>

      <!-- Filters -->
           <div class="filter-row">
        <mat-form-field appearance="fill" class="filter-field">
          <mat-label>Filter by Status</mat-label>
          <mat-select [(value)]="selectedStatus" (selectionChange)="loadRequests()">
            <mat-option value="">All</mat-option>
            <mat-option value="PENDING">Pending</mat-option>
            <mat-option value="APPROVED">Approved</mat-option>
            <mat-option value="REJECTED">Rejected</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill" class="filter-field">
          <mat-label>Search by Employee ID</mat-label>
          <input matInput placeholder="e.g. 5" [(ngModel)]="searchEmployeeId" (keyup.enter)="applyFilters()" />
        </mat-form-field>

        <mat-form-field appearance="fill" class="filter-field">
          <mat-label>From</mat-label>
          <input matInput [matDatepicker]="fromPicker" [(ngModel)]="fromDate" (dateChange)="applyFilters()" />
          <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
          <mat-datepicker #fromPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="fill" class="filter-field">
          <mat-label>To</mat-label>
          <input matInput [matDatepicker]="toPicker" [(ngModel)]="toDate" (dateChange)="applyFilters()" />
          <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
          <mat-datepicker #toPicker></mat-datepicker>
        </mat-form-field>

        <button mat-raised-button color="primary" (click)="clearFilters()">Clear</button>
      </div>

      <div *ngIf="loading" class="spinner-overlay">
        <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
      </div>

      <!-- Spinner -->
      <div *ngIf="loading" class="spinner-overlay">
        <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
      </div>

      <div class="selection-actions">
  <button
    mat-stroked-button
    color="primary"
    (click)="toggleSelectAll()"
  >
    {{ selection.hasValue() ? 'Deselect All' : 'Select All' }}
  </button>

  <span class="selection-info" *ngIf="selection.hasValue()">
    {{ selection.selected.length }} selected
  </span>
</div>
      <!-- Table (unchanged) -->
          <table mat-table [dataSource]="filteredRequests" class="mat-elevation-z8" *ngIf="!loading">

  <!-- ✅ Checkbox Column -->
  <ng-container matColumnDef="select">
    <th mat-header-cell *matHeaderCellDef>
      <mat-checkbox
        (change)="toggleAllRows($event)"
        [checked]="isAllSelected()"
        [indeterminate]="selection.hasValue() && !isAllSelected()">
      </mat-checkbox>
    </th>
    <td mat-cell *matCellDef="let row">
      <mat-checkbox
        (click)="$event.stopPropagation()"
        (change)="selection.toggle(row)"
        [checked]="selection.isSelected(row)">
      </mat-checkbox>
    </td>
  </ng-container>

  <!-- Employee -->
  <ng-container matColumnDef="employee">
    <th mat-header-cell *matHeaderCellDef>Employee</th>
    <td mat-cell *matCellDef="let r">{{ r.userId }}</td>
  </ng-container>

  <!-- Dates -->
  <ng-container matColumnDef="dates">
    <th mat-header-cell *matHeaderCellDef>Requested Dates</th>
    <td mat-cell *matCellDef="let r">{{ r.requestedDates?.join(', ') }}</td>
  </ng-container>

  <!-- Shift -->
  <ng-container matColumnDef="shift">
    <th mat-header-cell *matHeaderCellDef>Shift</th>
    <td mat-cell *matCellDef="let r">{{ r.shift }}</td>
  </ng-container>

  <!-- Status -->
  <ng-container matColumnDef="status">
    <th mat-header-cell *matHeaderCellDef>Status</th>
    <td mat-cell *matCellDef="let r"><span [ngClass]="r.status.toLowerCase()">{{ r.status }}</span></td>
  </ng-container>

  <!-- Comment -->
  <ng-container matColumnDef="comment">
    <th mat-header-cell *matHeaderCellDef>Admin Comment</th>
    <td mat-cell *matCellDef="let r">{{ r.adminComment || '-' }}</td>
  </ng-container>

  <!-- Actions -->
  <ng-container matColumnDef="actions">
    <th mat-header-cell *matHeaderCellDef>Actions</th>
    <td mat-cell *matCellDef="let r">
      <button mat-raised-button color="primary" (click)="openActionDialog(r, 'approve')" [disabled]="r.status !== 'PENDING'">
        Approve
      </button>
      <button mat-raised-button color="warn" (click)="openActionDialog(r, 'reject')" [disabled]="r.status !== 'PENDING'">
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
    .filter-row, .export-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
    .export-row button { font-weight: 500; }

    .filter-field {
      min-width: 160px;
    }

    .approved {
      color: green;
      font-weight: 600;
    }

    .pending {
      color: orange;
      font-weight: 600;
    }

    .rejected {
      color: red;
      font-weight: 600;
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
    .selection-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.selection-info {
  color: #00693e;
  font-weight: 500;
}

    .comment-tooltip {
      color: #1976d2;
      cursor: pointer;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {

  selection = new SelectionModel<any>(true, []);
  private shiftService = inject(RequestService);
  private snackbar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  requests: any[] = [];
  filteredRequests: any[] = [];
 columns = ['select', 'employee', 'dates', 'shift', 'status', 'comment', 'actions'];
  selectedStatus = '';
  searchEmployeeId = '';
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;
  fromDate?: Date;
  toDate?: Date;
  loading = false;

  ngOnInit() {
    this.loadRequests();
  }


isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.filteredRequests.length;
  return numSelected === numRows;
}

toggleAllRows(event: any) {
  if (event.checked) {
    this.selection.select(...this.filteredRequests);
  } else {
    this.selection.clear();
  }
}
toggleSelectAll() {
  if (this.selection.hasValue()) {
    this.selection.clear();
  } else {
    this.selection.select(...this.filteredRequests);
  }
}

  loadRequests() {
    this.loading = true;
    this.shiftService.getAllRequests(this.pageIndex, this.pageSize, this.selectedStatus).subscribe({
      next: (res: any) => {
        this.requests = (res.content || res).map((r: any) => ({ ...r, _visible: true }));
        this.totalElements = res.totalElements || this.requests.length;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackbar.open('Failed to load requests', 'Dismiss', { duration: 3000 });
      }
    });
  }

    applyFilters() {
    let data = [...this.requests];

    if (this.searchEmployeeId) {
      data = data.filter(r => String(r.userId).includes(this.searchEmployeeId.trim()));
    }

    if (this.fromDate) {
      const from = this.fromDate.toISOString().split('T')[0];
      data = data.filter(r => r.requestedDates.some((d: string) => d >= from));
    }

    if (this.toDate) {
      const to = this.toDate.toISOString().split('T')[0];
      data = data.filter(r => r.requestedDates.some((d: string) => d <= to));
    }

    this.filteredRequests = data;
  }

    clearFilters() {
    this.searchEmployeeId = '';
    this.fromDate = undefined;
    this.toDate = undefined;
    this.selectedStatus = '';
    this.loadRequests();
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
            // Animate row
            request._visible = false;
            setTimeout(() => {
              request.status = action === 'approve' ? 'APPROVED' : 'REJECTED';
              request.adminComment = comment;
              request._visible = true;
              this.loading = false;
              this.showActionToast(action);
            }, 250);
          },
          error: () => {
            this.loading = false;
            this.snackbar.open(`Failed to ${action} request`, 'Dismiss', { duration: 3000 });
          }
        });
      }
    });
  }

  private showActionToast(action: 'approve' | 'reject') {
    const message = action === 'approve'
      ? '✅ Request approved successfully!'
      : '❌ Request rejected successfully!';
    const panelClass = action === 'approve' ? 'snack-approve' : 'snack-reject';

    this.snackbar.open(message, 'OK', {
      duration: 2500,
      panelClass
    });
  }

  private getTimestamp(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}_${hh}-${min}`;
}

  // 🧾 Export current filtered list to CSV
exportToCSV() {
  if (!this.filteredRequests.length) {
    this.snackbar.open('No data to export', 'Dismiss', { duration: 2500 });
    return;
  }

  if (this.selection.hasValue()) {
    const dialogRef = this.dialog.open(ExportConfirmDialogComponent, {
      width: '380px',
      data: { count: this.selection.selected.length }
    });

    dialogRef.afterClosed().subscribe(choice => {
      if (choice === 'selected') {
        this.generateCSV(this.selection.selected);
      } else if (choice === 'all') {
        this.generateCSV(this.filteredRequests);
      }
    });
  } else {
    this.generateCSV(this.filteredRequests);
  }
}

private generateCSV(dataToExport: any[]) {
  const header = Object.keys(dataToExport[0]);
  const csvRows = [
    header.join(','),
    ...dataToExport.map(r => header.map(h => JSON.stringify(r[h] ?? '')).join(','))
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const username = localStorage.getItem('shift-app-username') || 'admin';
  const filename = `shift_requests_${username}_${this.getTimestamp()}.csv`;

  saveAs(blob, filename);
  this.snackbar.open(`CSV exported (${dataToExport.length} rows)`, 'OK', { duration: 2000 });
}


private generateExcel(dataToExport: any[]) {
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Shift Requests');

  const username = localStorage.getItem('shift-app-username') || 'admin';
  const filename = `shift_requests_${username}_${this.getTimestamp()}.xlsx`;
  
  XLSX.writeFile(workbook, filename);
  this.snackbar.open(`Excel exported (${dataToExport.length} rows)`, 'OK', { duration: 2000 });
}

  // 📊 Export current filtered list to Excel
exportToExcel() {
  if (!this.filteredRequests.length) {
    this.snackbar.open('No data to export', 'Dismiss', { duration: 2500 });
    return;
  }

  if (this.selection.hasValue()) {
    const dialogRef = this.dialog.open(ExportConfirmDialogComponent, {
      width: '380px',
      data: { count: this.selection.selected.length }
    });

    dialogRef.afterClosed().subscribe(choice => {
      if (choice === 'selected') {
        this.generateExcel(this.selection.selected);
      } else if (choice === 'all') {
        this.generateExcel(this.filteredRequests);
      }
    });
  } else {
    this.generateExcel(this.filteredRequests);
  }
}

}
