import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoggerService } from '../services/logger.service';
import { NotificationService } from '../services/notification.service';

/**
 * Interceptor funcional de manejo de errores HTTP (Angular 20)
 * - Maneja 401/403/500/0 con notificaciones y logging
 * - Limpia sesión y redirige en 401 si no está en /login
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const logger = inject(LoggerService);
  const auth = inject(AuthService);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const status = error.status;
      const currentUrl = router.url || '';
      const isOnLogin = currentUrl.startsWith('/login');

      // Log de error (siempre)
      logger.error('HTTP Error', {
        url: req.url,
        message: error.message,
        status,
      });

      switch (status) {
        case 401: {
          // Sesión expirada / inválida
          notification.warning(
            'Tu sesión ha expirado. Por favor inicia sesión nuevamente.'
          );
          // logout() ya limpia storage y navega a /login
          auth.logout();
          // Si ya estamos en login, evitar navegación redundante
          if (isOnLogin) {
            // No hacer nada extra
          }
          break;
        }
        case 403: {
          notification.error('No tienes permisos para acceder a este recurso.');
          break;
        }
        case 500: {
          notification.error(
            'Ha ocurrido un error interno, intenta de nuevo más tarde.'
          );
          break;
        }
        case 0: {
          notification.error(
            'Error de conexión, revisa tu red o intenta más tarde.'
          );
          break;
        }
        default: {
          // Otros códigos: sin acción adicional
          break;
        }
      }

      return throwError(() => error);
    })
  );
};
