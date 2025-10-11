import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {

    private tokenKey = 'shift-app-token';
  private roleKey = 'shift-app-role';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string, password: string }) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials)
      .subscribe(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.roleKey, res.role);
        this.router.navigate([res.role === 'ADMIN' ? '/admin' : '/dashboard']);
      });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
}
