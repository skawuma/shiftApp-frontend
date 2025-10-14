import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../servicves/auth';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
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
    <div class="register-wrapper">
      <mat-card class="register-card">
        <h2>Employee Registration</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="fill" class="full">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" />
            <mat-error *ngIf="form.controls['username'].hasError('required')">Username is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill" class="full">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" />
            <mat-error *ngIf="form.controls['email'].hasError('required')">Email is required</mat-error>
            <mat-error *ngIf="form.controls['email'].hasError('email')">Invalid email</mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill" class="full">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" />
            <mat-error *ngIf="form.controls['password'].hasError('required')">Password is required</mat-error>
            <mat-error *ngIf="form.controls['password'].hasError('minlength')">Minimum 6 characters</mat-error>
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>

        <p class="login-link">
          Already have an account? <a routerLink="/login">Login</a>
        </p>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-wrapper { display:flex; justify-content:center; align-items:center; height:100vh; background:#f5f7fb; }
    .register-card { width:380px; padding:24px; }
    .full { width:100%; }
    .login-link { margin-top:12px; text-align:center; }
  `]
})
export class RegisterComponent implements OnInit {
   form!:FormGroup
  loading = false;


  constructor(private fb: FormBuilder, private auth: Auth, private snack: MatSnackBar, private router: Router) {}
  ngOnInit(): void {
      this.form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.register(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.snack.open( 'Registration successful', 'OK', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'Registration failed';
        this.snack.open(msg, 'Close', { duration: 4000 });
      }
    });
  }
}
