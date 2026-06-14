import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Auth } from '../servicves/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-wrapper">
      <mat-card class="auth-card">
        <h2>Reset your password</h2>
        <p>Enter your username or email. We will send a secure reset link if an account matches.</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="fill">
            <mat-label>Username or email</mat-label>
            <input matInput formControlName="identifier" autocomplete="username" />
            <mat-error *ngIf="form.controls.identifier.hasError('required')">This field is required</mat-error>
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Sending...' : 'Send reset link' }}
          </button>
        </form>

        <a routerLink="/login">Back to login</a>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-wrapper { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:16px; background:#f5f7fb; }
    .auth-card { width:min(420px, 100%); padding:24px; }
    form { display:flex; flex-direction:column; gap:12px; margin:18px 0; }
    p { color:#4b5563; line-height:1.5; }
    a { color:#1976d2; text-decoration:none; }
  `]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private snack = inject(MatSnackBar);

  loading = false;
  form = this.fb.nonNullable.group({
    identifier: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.forgotPassword(this.form.getRawValue().identifier).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.snack.open(response?.message || 'Check your email for a reset link.', 'OK', { duration: 6000 });
      },
      error: () => {
        this.loading = false;
        this.snack.open('Unable to request a reset link right now.', 'Close', { duration: 5000 });
      }
    });
  }
}
