import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from './logger.service';

/**
 * Opciones para las peticiones HTTP
 */
export interface ApiRequestOptions {
  headers?: { [key: string]: string };
  params?: { [key: string]: string | number | boolean };
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

/**
 * Servicio centralizado para peticiones HTTP
 *
 * Características:
 * - Usa rutas relativas (el BaseUrlInterceptor agrega la URL base)
 * - El AuthInterceptor agrega automáticamente el token
 * - El LoadingInterceptor maneja el estado de carga
 * - El ErrorInterceptor maneja errores globalmente
 * - Convierte Observables a Promises para mejor UX
 * - Logging centralizado con LoggerService
 *
 * Uso:
 * ```typescript
 * // GET
 * const users = await this.api.get<User[]>('users');
 *
 * // POST
 * const newUser = await this.api.post<User>('users', { name: 'John' });
 *
 * // Con parámetros
 * const filtered = await this.api.get<User[]>('users', {
 *   params: { role: 'admin', active: true }
 * });
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly logger: LoggerService
  ) {}

  /**
   * Realiza una petición GET
   * @param path - Ruta relativa del endpoint (ej: 'users', 'users/123')
   * @param options - Opciones de la petición (headers, params)
   * @returns Promise con la respuesta tipada
   */
  async get<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    try {
      this.logger.debug(`GET ${path}`, options);
      const response = await firstValueFrom(
        this.http.get<T>(path, this.buildHttpOptions(options))
      );
      this.logger.debug(`GET ${path} - Success`, response);
      return response;
    } catch (error) {
      this.logger.error(`GET ${path} - Error`, error);
      throw error;
    }
  }

  /**
   * Realiza una petición POST
   * @param path - Ruta relativa del endpoint
   * @param body - Cuerpo de la petición
   * @param options - Opciones de la petición
   * @returns Promise con la respuesta tipada
   */
  async post<T>(
    path: string,
    body: any,
    options?: ApiRequestOptions
  ): Promise<T> {
    try {
      this.logger.debug(`POST ${path}`, { body, options });
      const response = await firstValueFrom(
        this.http.post<T>(path, body, this.buildHttpOptions(options))
      );
      this.logger.debug(`POST ${path} - Success`, response);
      return response;
    } catch (error) {
      this.logger.error(`POST ${path} - Error`, error);
      throw error;
    }
  }

  /**
   * Realiza una petición PUT
   * @param path - Ruta relativa del endpoint
   * @param body - Cuerpo de la petición
   * @param options - Opciones de la petición
   * @returns Promise con la respuesta tipada
   */
  async put<T>(
    path: string,
    body: any,
    options?: ApiRequestOptions
  ): Promise<T> {
    try {
      this.logger.debug(`PUT ${path}`, { body, options });
      const response = await firstValueFrom(
        this.http.put<T>(path, body, this.buildHttpOptions(options))
      );
      this.logger.debug(`PUT ${path} - Success`, response);
      return response;
    } catch (error) {
      this.logger.error(`PUT ${path} - Error`, error);
      throw error;
    }
  }

  /**
   * Realiza una petición PATCH
   * @param path - Ruta relativa del endpoint
   * @param body - Cuerpo de la petición (datos parciales)
   * @param options - Opciones de la petición
   * @returns Promise con la respuesta tipada
   */
  async patch<T>(
    path: string,
    body: any,
    options?: ApiRequestOptions
  ): Promise<T> {
    try {
      this.logger.debug(`PATCH ${path}`, { body, options });
      const response = await firstValueFrom(
        this.http.patch<T>(path, body, this.buildHttpOptions(options))
      );
      this.logger.debug(`PATCH ${path} - Success`, response);
      return response;
    } catch (error) {
      this.logger.error(`PATCH ${path} - Error`, error);
      throw error;
    }
  }

  /**
   * Realiza una petición DELETE
   * @param path - Ruta relativa del endpoint
   * @param options - Opciones de la petición
   * @returns Promise con la respuesta tipada
   */
  async delete<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    try {
      this.logger.debug(`DELETE ${path}`, options);
      const response = await firstValueFrom(
        this.http.delete<T>(path, this.buildHttpOptions(options))
      );
      this.logger.debug(`DELETE ${path} - Success`, response);
      return response;
    } catch (error) {
      this.logger.error(`DELETE ${path} - Error`, error);
      throw error;
    }
  }

  /**
   * Construye las opciones HTTP desde ApiRequestOptions
   * Convierte headers y params a objetos HttpHeaders y HttpParams
   * @param options - Opciones de la petición
   * @returns Objeto de opciones para HttpClient
   */
  private buildHttpOptions(options?: ApiRequestOptions): {
    headers?: HttpHeaders;
    params?: HttpParams;
    responseType?: any;
  } {
    const httpOptions: any = {};

    if (options?.headers) {
      httpOptions.headers = new HttpHeaders(options.headers);
    }

    if (options?.params) {
      let params = new HttpParams();
      Object.keys(options.params).forEach((key) => {
        params = params.set(key, String(options.params![key]));
      });
      httpOptions.params = params;
    }

    if (options?.responseType) {
      httpOptions.responseType = options.responseType;
    }

    return httpOptions;
  }
}
