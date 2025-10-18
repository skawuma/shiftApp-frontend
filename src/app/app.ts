import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Auth } from './servicves/auth';
import { NgIf } from '@angular/common';
import { EmployeeDashboardComponent } from './employee-dashboard-component/employee-dashboard-component';
import { HeaderComponent } from './shared/header/header.component'; 
import { from } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [NgIf, RouterModule, MatToolbarModule, MatButtonModule, RouterOutlet],
  template: `
    <mat-toolbar color="primary">
      <span>Shift Request App</span>
      <span class="spacer"></span>
      <button mat-button *ngIf="auth.isLoggedIn()" (click)="auth.logout()">Logout</button>
    </mat-toolbar>

    <router-outlet></router-outlet>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    :host { display: block; padding: 20px; }
  `]
})
export class AppComponent {
  constructor(public auth:Auth){}
}
