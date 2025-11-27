import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LoggerService } from '../services/logger.service';

/**
 * Interceptor funcional de manejo de errores HTTP (Angular 20 style)
 * Centraliza el manejo de errores de todas las peticiones HTTP
 * Usa LoggerService para logging controlado por ambiente
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Manejo de error 401: Usuario no autenticado
      if (error.status === 401) {
        logger.warn('Unauthorized access - redirecting to login', {
          url: req.url,
        });
        router.navigate(['/login']);
      }

      // Manejo de error 403: Usuario sin permisos
      if (error.status === 403) {
        logger.warn('Forbidden access - insufficient permissions', {
          url: req.url,
        });
        router.navigate(['/home']);
      }

      // Manejo de error 500: Error del servidor
      if (error.status === 500) {
        logger.error('Server error', error);
        // TODO: Mostrar notificación al usuario
      }

      // Manejo de error 0: Sin conexión a internet
      if (error.status === 0) {
        logger.error('Network error - no connection');
        // TODO: Mostrar notificación al usuario
      }

      // Log general del error
      if (error.status >= 400) {
        logger.error(`HTTP Error ${error.status}`, {
          url: req.url,
          message: error.message,
          status: error.status,
        });
      }

      return throwError(() => error);
    })
  );
};
