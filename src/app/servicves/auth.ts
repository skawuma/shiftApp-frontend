import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  role: string;
  userId?: number;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private base = `${environment.apiUrl}/auth`;
  private tokenKey = 'shift-app-token';
  private roleKey = 'shift-app-role';
  private userIdKey = 'shift-app-userId';
  private emailKey = 'shift-app-email';

  constructor(private http: HttpClient,private router: Router) {}

  // returns observable so caller can subscribe and react
  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, credentials).pipe(
      tap(res => {
        if (res?.token) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.roleKey, res.role ?? '');
          if (res.userId !== undefined) localStorage.setItem(this.userIdKey, String(res.userId));
          if (res.email) localStorage.setItem(this.emailKey, res.email);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.emailKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  getRole(): string | null { return localStorage.getItem(this.roleKey); }
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
