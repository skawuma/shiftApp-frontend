import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard-component/admin-dashboard-component';
import { EmployeeDashboardComponent } from './employee-dashboard-component/employee-dashboard-component';
import { LoginComponent } from './login-component/login-component';
import { authGuard } from './auth-guard';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: EmployeeDashboardComponent, canActivate: [authGuard], data: { role: 'EMPLOYEE' } },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard], data: { role: 'ADMIN' } },
  { path: '**', redirectTo: 'login' }

];
