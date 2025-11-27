import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

/**
 * Interceptor funcional de autenticación (Angular 20 style)
 * Agrega automáticamente el token Bearer a todas las peticiones HTTP
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si no hay token, continuar sin modificar la petición
  if (!token) {
    return next(req);
  }

  // Clonar la petición y agregar el header de autorización
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
