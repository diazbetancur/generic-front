import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Interceptor funcional de URL base (Angular 20 style)
 * Agrega automáticamente la URL base del API a todas las peticiones relativas
 * Las URLs absolutas (que comienzan con http/https) no se modifican
 */
export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.apiUrl.replace(/\/$/, '');

  // Si la URL ya es absoluta (http/https), no modificarla
  if (/^https?:\/\//i.test(req.url)) {
    return next(req);
  }

  // Eliminar "/" inicial si existe y construir la URL completa
  const cleanPath = req.url.replace(/^\//, '');
  const apiReq = req.clone({
    url: `${baseUrl}/${cleanPath}`,
  });

  return next(apiReq);
};
