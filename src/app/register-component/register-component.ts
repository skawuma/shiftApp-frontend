import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Auth } from '../servicves/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>Register New Account</h2>

    <div mat-dialog-content>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="register-form">
        <mat-form-field appearance="fill" class="full">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" />
          <mat-error *ngIf="form.controls['username'].hasError('required')">Username is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
          <mat-error *ngIf="form.controls['email'].hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="form.controls['email'].hasError('email')">Invalid email format</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" />
          <mat-error *ngIf="form.controls['password'].hasError('required')">Password is required</mat-error>
          <mat-error *ngIf="form.controls['password'].hasError('minlength')">Minimum 6 characters</mat-error>
        </mat-form-field>

        <div class="actions">
          <button mat-stroked-button type="button" (click)="close()">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .register-form { display:flex; flex-direction:column; gap:12px; padding-top:8px; }
    .full { width:100%; }
    .actions { display:flex; justify-content:space-between; margin-top:10px; }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  


  constructor(
    private router:Router,
    private fb: FormBuilder,
    private auth: Auth,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<RegisterComponent>
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

onSubmit() {
  if (this.form.invalid) return;
  this.loading = true;

  const registerData = this.form.value;

  this.auth.register(registerData).subscribe({

    next: () => {
  const { username, password } = this.form.value;
  this.auth.login({ username, password }).subscribe({
    next: (res) => {
      this.snack.open('🎉 Registered and logged in!', 'OK', { duration: 3000 });
       this.dialogRef.close();
      // store token + role
      localStorage.setItem('shift-app-token', res.token);
      localStorage.setItem('shift-app-role', res.role);
      localStorage.setItem('shift-app-userId',String(res.userId));

      // redirect based on role
      if (res.role === 'ROLE_ADMIN') this.router.navigate(['/admin']);
      else this.router.navigate(['/dashboard']);
    },
    error: () => {
      this.snack.open('Registration successful, but auto-login failed.', 'OK', { duration: 3000 });
      this.router.navigate(['/login']);
    }
  });
}

,
    error: (err) => {
      this.loading = false;
      const msg = err?.error?.message || 'Registration failed';
      this.snack.open(msg, 'Close', { duration: 3000 });
    }
  });
}

  close() {
    this.dialogRef.close();
  }
}
