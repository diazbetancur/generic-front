import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { UtilsService } from '../../services/utils.service';

/**
 * Interceptor funcional de carga (Angular 19 style)
 * Muestra/oculta automáticamente un indicador de carga durante las peticiones HTTP
 * Puedes configurar URLs que no deben mostrar el indicador de carga
 */

// Configura aquí las rutas que NO deben mostrar el indicador de carga
const SKIP_URLS: string[] = [
  // Ejemplo: '/auth/refresh-token'
];

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const utilsService = inject(UtilsService);
  const shouldSkip = SKIP_URLS.some((url) => req.url.includes(url));

  if (!shouldSkip) {
    if (activeRequests === 0) {
      utilsService.showLoading();
    }
    activeRequests++;
  }

  return next(req).pipe(
    finalize(() => {
      if (!shouldSkip) {
        activeRequests--;
        if (activeRequests === 0) {
          utilsService.hideLoading();
        }
      }
    })
  );
};
