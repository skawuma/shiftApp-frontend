import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Auth } from './servicves/auth';


@Component({
  selector: 'app-root',
  imports: [RouterModule,MatToolbarModule,MatButtonModule],
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
