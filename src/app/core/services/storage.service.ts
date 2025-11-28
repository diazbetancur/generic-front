import { Injectable } from '@angular/core';

/**
 * Enum de keys para localStorage
 * Centraliza todas las keys usadas en la aplicación
 */
export enum StorageKey {
  AUTH_TOKEN = 'auth_token',
  USER_DATA = 'user_data',
  REFRESH_TOKEN = 'refresh_token',
}

/**
 * Servicio centralizado para manejo de localStorage
 * Proporciona una abstracción type-safe sobre localStorage
 * Facilita testing y mantenimiento
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly PREFIX = '__PROJECT_SLUG___';

  /**
   * Guarda un valor en localStorage con manejo de errores
   * @param key - Llave del storage (enum StorageKey)
   * @param value - Valor a guardar (se serializa automáticamente)
   * @returns boolean indicando si se guardó correctamente
   */
  set<T>(key: StorageKey, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.PREFIX + key, serialized);
      return true;
    } catch (error) {
      // Error silencioso, LoggerService se encargará si es necesario
      return false;
    }
  }

  /**
   * Obtiene un valor de localStorage con type safety
   * @param key - Llave del storage (enum StorageKey)
   * @returns El valor deserializado o null si no existe
   */
  get<T>(key: StorageKey): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      return null;
    }
  }

  /**
   * Elimina un valor de localStorage
   * @param key - Llave del storage (enum StorageKey)
   */
  remove(key: StorageKey): void {
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (error) {
      // Error silencioso
    }
  }

  /**
   * Limpia todo el storage de la aplicación
   * Solo elimina items con el PREFIX de la app
   */
  clear(): void {
    try {
      Object.values(StorageKey).forEach((key) => {
        this.remove(key as StorageKey);
      });
    } catch (error) {
      // Error silencioso
    }
  }

  /**
   * Verifica si existe una key en localStorage
   * @param key - Llave del storage (enum StorageKey)
   * @returns boolean indicando si existe
   */
  has(key: StorageKey): boolean {
    return localStorage.getItem(this.PREFIX + key) !== null;
  }
}
