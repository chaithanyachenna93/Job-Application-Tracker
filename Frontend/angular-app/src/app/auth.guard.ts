import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (typeof window === 'undefined') return false;

    const isLoggedIn = !!localStorage.getItem('token');

    if (!isLoggedIn) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
