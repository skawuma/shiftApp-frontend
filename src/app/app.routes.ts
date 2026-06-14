import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard-component/admin-dashboard-component';
import { EmployeeDashboardComponent } from './employee-dashboard-component/employee-dashboard-component';
import { LoginComponent } from './login-component/login-component';
import { authGuard } from './auth-guard';
import { RegisterComponent } from './register-component/register-component';
import { HeaderComponent } from './shared/header/header.component';
import { ForgotPasswordComponent } from './forgot-password-component/forgot-password-component';
import { ResetPasswordComponent } from './reset-password-component/reset-password-component';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: EmployeeDashboardComponent, canActivate: [authGuard], data: { role: 'ROLE_EMPLOYEE' } },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'register', component: RegisterComponent },
  {path:'header',component:HeaderComponent},

  { path: '**', redirectTo: 'login' }

];
