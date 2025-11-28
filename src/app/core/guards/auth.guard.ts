import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Guard funcional de autenticación (Angular 20 style)
 * Protege las rutas que requieren autenticación
 */
export const authMatchGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  const attemptedUrl = '/' + segments.map((s) => s.path).join('/');
  router.navigate(['/login'], { queryParams: { returnUrl: attemptedUrl } });
  return false;
};
