import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Niveles de logging disponibles
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Servicio centralizado de logging
 * Controla qué se registra según el ambiente (dev/prod)
 * En producción, solo registra errores críticos
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly logLevel: LogLevel = environment.production
    ? LogLevel.ERROR
    : LogLevel.DEBUG;

  /**
   * Log de debugging (solo en desarrollo)
   * @param message - Mensaje a registrar
   * @param args - Argumentos adicionales
   */
  debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, args);
  }

  /**
   * Log informativo (solo en desarrollo)
   * @param message - Mensaje a registrar
   * @param args - Argumentos adicionales
   */
  info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, args);
  }

  /**
   * Log de advertencia
   * @param message - Mensaje a registrar
   * @param args - Argumentos adicionales
   */
  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, args);
  }

  /**
   * Log de error (siempre se registra)
   * En producción podría enviarse a servicio externo (Sentry, LogRocket, etc.)
   * @param message - Mensaje de error
   * @param error - Objeto de error (opcional)
   */
  error(message: string, error?: any): void {
    this.log(LogLevel.ERROR, message, error ? [error] : []);

    // TODO: En producción, enviar a servicio de logging externo
    // if (environment.production) {
    //   this.sendToExternalLogger(message, error);
    // }
  }

  /**
   * Método privado para hacer el logging real
   * @param level - Nivel de logging
   * @param message - Mensaje
   * @param args - Argumentos adicionales
   */
  private log(level: LogLevel, message: string, args: any[]): void {
    // No registrar si el nivel es menor al configurado
    if (level < this.logLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${LogLevel[level]}]`;

    // En desarrollo, usar console según nivel
    if (!environment.production) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(prefix, message, ...args);
          break;
        case LogLevel.INFO:
          console.info(prefix, message, ...args);
          break;
        case LogLevel.WARN:
          console.warn(prefix, message, ...args);
          break;
        case LogLevel.ERROR:
          console.error(prefix, message, ...args);
          break;
      }
    } else {
      // En producción, solo errores críticos a console
      if (level === LogLevel.ERROR) {
        console.error(prefix, message);
      }
    }
  }

  /**
   * Método placeholder para envío a servicio externo
   * @param message - Mensaje
   * @param error - Error
   */
  private sendToExternalLogger(message: string, error: any): void {
    // TODO: Implementar integración con Sentry, LogRocket, etc.
    // Ejemplo:
    // Sentry.captureException(error, { extra: { message } });
  }
}
