// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * RoleGuard: protege rutas según roles requeridos en Route.data.roles
 * Uso: canMatch: [authMatchGuard, roleGuard], data: { roles: ['Admin'] }
 */
export const roleGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const auth = inject(AuthService);
  const notify = inject(NotificationService);
  const router = inject(Router);

  const requiredRoles = (route.data?.['roles'] as string[] | undefined) ?? [];

  // Si no hay roles configurados, permitir acceso
  if (!requiredRoles.length) {
    return true;
  }

  // Verificar que el usuario tenga al menos uno de los roles requeridos
  const hasSomeRole = requiredRoles.some((role) => auth.hasRole(role));
  if (!hasSomeRole) {
    notify.error('No tienes permisos para acceder a esta sección.');
    router.navigate(['/home']);
    return false;
  }

  // Validar permisos por path si el backend los provee
  const attemptedPath = '/' + segments.map((s) => s.path).join('/');
  const canAccess = auth.canAccessPath(attemptedPath);
  if (!canAccess) {
    notify.error('No tienes permisos para acceder a este recurso.');
    router.navigate(['/home']);
    return false;
  }

  return true;
};
