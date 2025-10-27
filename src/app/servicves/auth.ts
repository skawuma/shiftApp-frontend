import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

export interface LoginResponse {
  token: string;
  role: string;
  userId?: number;
  email?: string;
  username: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class Auth  {

  private base = `${environment.apiUrl}/auth`;
  private tokenKey = 'shift-app-token';
  private roleKey = 'shift-app-role';
  private userIdKey = 'shift-app-userId';
  private emailKey = 'shift-app-email';
   private usernameKey = 'shift-app-username';
 

  constructor(private http: HttpClient,private router: Router,private snack:MatSnackBar) {}
 
  

  usernames= this.getUsername() ;
  // returns observable so caller can subscribe and react
  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, credentials).pipe(
      tap(res => {
        if (res?.token) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.roleKey, res.role ?? '');
          if (res.userId !== undefined) localStorage.setItem(this.userIdKey, String(res.userId));
          if (res.email) localStorage.setItem(this.emailKey, res.email);
           if (res.username)localStorage.setItem(this.usernameKey,res.username);
          // if (res.username) localStorage.setItem(this.usernameKey,res.username);
        }
      })
    );
  }
logout(): void {
  const confirmed = confirm(`Are you sure you want to log out, ${this.usernames}?`);

  if (!confirmed) {
    // Cancel pressed → stay logged in
    this.snack.open(`Logout cancelled. You're still logged in, ${this.usernames}.`, 'OK', { duration: 3000 });
    return;
  }

  // Proceed with logout
  localStorage.removeItem(this.tokenKey);
  localStorage.removeItem(this.roleKey);
  localStorage.removeItem(this.userIdKey);
  localStorage.removeItem(this.emailKey);
  localStorage.removeItem('shift-app-username');  // ensure consistent key name

  this.snack.open(`✅ Logged out successfully. Goodbye, ${'shift-app-usernam'}!`, 'OK', { duration: 3000 });
  this.router.navigate(['/login']);
}

  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  getRole(): string | null { return localStorage.getItem(this.roleKey); }
  getUsername(): string | null { return localStorage.getItem('shift-app-username'); }
  getUserId(): number | null {
    const v = localStorage.getItem(this.userIdKey);
    return v ? Number(v) : null;
  }

  isLoggedIn(): boolean { return !!this.getToken();

   }

   register(data: { username: string; email: string; password: string }) {
  return this.http.post(`${this.base}/register`, data);
   }
}
