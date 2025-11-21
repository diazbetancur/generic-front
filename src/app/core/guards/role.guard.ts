import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user = this.authService.getUser();
    const requiredRoles = route.data['roles'] as Array<string>;

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRoles && !user.roles.some(role => requiredRoles.includes(role))) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}

