import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Auth } from '../servicves/auth';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  return control.get('password')?.value === control.get('confirmPassword')?.value
    ? null
    : { passwordsMismatch: true };
}

@Component({
  selector: 'app-reset-password',
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
        <h2>Choose a new password</h2>
        <p class="rules">Use at least 10 characters. Do not use your current password, username, email, or a possible birth year.</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="fill">
            <mat-label>New password</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="new-password" />
            <mat-error *ngIf="form.controls.password.hasError('minlength')">Use at least 10 characters</mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Confirm new password</mat-label>
            <input matInput type="password" formControlName="confirmPassword" autocomplete="new-password" />
          </mat-form-field>
          <p class="form-error" *ngIf="form.hasError('passwordsMismatch') && form.controls.confirmPassword.touched">
            Passwords do not match
          </p>

          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading || !token">
            {{ loading ? 'Updating...' : 'Update password' }}
          </button>
        </form>

        <a routerLink="/forgot-password">Request a new reset link</a>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-wrapper { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:16px; background:#f5f7fb; }
    .auth-card { width:min(440px, 100%); padding:24px; }
    form { display:flex; flex-direction:column; gap:12px; margin:18px 0; }
    .rules { color:#4b5563; line-height:1.5; }
    .form-error { color:#b3261e; font-size:12px; margin:-8px 0 0; }
    a { color:#1976d2; text-decoration:none; }
  `]
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  token = this.route.snapshot.queryParamMap.get('token') ?? '';
  loading = false;
  form = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(10)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordsMatch });

  submit() {
    if (this.form.invalid || !this.token) return;
    this.loading = true;
    this.auth.resetPassword(this.token, this.form.getRawValue().password).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Password updated. You can now sign in.', 'OK', { duration: 5000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.snack.open(err?.error?.message || 'Reset link is invalid or expired.', 'Close', { duration: 6000 });
      }
    });
  }
}
