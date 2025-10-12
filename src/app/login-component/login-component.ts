import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CommonModule } from '@angular/common';
import { Auth } from '../servicves/auth';

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
    MatSnackBarModule
  ],
  template: `
    <div class="login-wrapper">
      <mat-card class="login-card">
        <h2>Sign in</h2>

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
            <mat-error *ngIf="form.controls['password'].hasError('minlength')">
              Password must be at least 6 characters
            </mat-error>
          </mat-form-field>

          <div class="actions">
            <button mat-stroked-button type="button" (click)="fillDemo()">Demo</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading">
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-wrapper { display:flex; justify-content:center; align-items:center; height:100vh; padding: 16px; background:#f5f7fb; }
    .login-card { width: 380px; padding: 24px; }
    .login-form { display:flex; flex-direction:column; gap:12px; }
    .full { width:100%; }
    .actions { display:flex; justify-content:space-between; align-items:center; margin-top:8px; }
  `]
})
export class LoginComponent  implements OnInit{
 form!:FormGroup

  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  fillDemo() {
    // handy for quick local testing: demo admin / employee credentials
    this.form.setValue({ username: 'admin', password: 'admin123' });
  }
  ngOnInit(): void {
      this.form = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.snack.open('Login successful', 'OK', { duration: 2000 });

        // redirect by role
        const role = res.role ?? this.auth.getRole();
        if (role === 'ADMIN') this.router.navigate(['/admin']);
        else this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || err?.message || 'Login failed';
        this.snack.open(msg, 'Close', { duration: 4000 });
      }
    });
  }
}
