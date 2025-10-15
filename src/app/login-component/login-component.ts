import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Auth } from '../servicves/auth';
import { RegisterComponent } from '../register-component/register-component';
import { MatIcon } from '@angular/material/icon';
 // 👈 new dialog component

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIcon
],
  template: `
    <div class="login-wrapper">
      <mat-card class="login-card">
        <h2>Login</h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
          <mat-form-field appearance="fill" class="full">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" autocomplete="username" />
            <mat-error *ngIf="form.controls['username'].hasError('required')">
              Username is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill" class="full">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="current-password" />
            <mat-error *ngIf="form.controls['password'].hasError('required')">
              Password is required
            </mat-error>
          </mat-form-field>

          <div class="actions">
            <button mat-stroked-button type="button" (click)="fillDemo()">Demo</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading">
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <p class="register-link">
          Don’t have an account? 
          <a (click)="openRegisterDialog()">
             <mat-icon inline>person_add</mat-icon>Register one here</a>
        </p>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-wrapper { display:flex; justify-content:center; align-items:center; height:100vh; background:#f5f7fb; padding:16px; }
    .login-card { width: 380px; padding: 24px; }
    .login-form { display:flex; flex-direction:column; gap:12px; }
    .full { width:100%; }
    .actions { display:flex; justify-content:space-between; align-items:center; margin-top:8px; }
    .register-link { text-align:center; margin-top:16px; font-size:14px; }
    .register-link a {  color: #1976d2;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px; }
  `]
})
export class LoginComponent implements OnInit {
  private auth = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  form!: FormGroup;
  loading = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  fillDemo() {
    this.form.setValue({ username: 'admin', password: 'admin123' });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.snack.open('Login successful', 'OK', { duration: 2000 });
        const role = res.role ?? this.auth.getRole();
        if (role === 'ROLE_ADMIN') this.router.navigate(['/admin']);
        else this.router.navigate(['/dashboard']);
        console.log(res);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'Login failed';
        this.snack.open(msg, 'Close', { duration: 4000 });
      }
      
    });
  }

openRegisterDialog() {
  const dialogRef = this.dialog.open(RegisterComponent, {
    width: '420px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result === 'registered') {
      this.snack.open('✅ Registration successful! Please log in.', 'OK', { duration: 3000 });
    } else if (result === 'auto-logged-in') {
      // 🚀 Skip manual login and redirect immediately
      const role = localStorage.getItem('shift-app-role');
      if (role === 'ROLE_ADMIN') this.router.navigate(['/admin']);
      else this.router.navigate(['/dashboard']);
    }
  });
}
}
