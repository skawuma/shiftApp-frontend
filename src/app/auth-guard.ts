import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router } from '@angular/router';
import { Auth } from './servicves/auth';

@Injectable({ providedIn: 'root' })
export class authGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    const expectedRole = route.data['role'];
    if (expectedRole && this.auth.getRole() !== expectedRole) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
