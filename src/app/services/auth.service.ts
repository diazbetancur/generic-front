import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { StorageKey, StorageService } from '../core/services/storage.service';
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  User,
} from '../interfaces/user.interface';

/**
 * Servicio de autenticación centralizado
 * Maneja login, logout, y estado del usuario autenticado
 * Usa StorageService para persistencia segura y ApiService para HTTP
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserSubject: BehaviorSubject<User | null>;

  /**
   * Observable del usuario actual
   * Los componentes pueden suscribirse para reaccionar a cambios de autenticación
   */
  public readonly currentUser$: Observable<User | null>;

  constructor(
    private readonly api: ApiService,
    private readonly storage: StorageService,
    private readonly router: Router
  ) {
    // Inicializar BehaviorSubject después de inyecciones
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.storage.get<User>(StorageKey.USER_DATA)
    );
    this.currentUser$ = this.currentUserSubject.asObservable();

    // Sincronizar estado inicial si hay sesión guardada
    const token = this.getToken();
    const user = this.getUser();
    if (token && user) {
      this.currentUserSubject.next(user);
    }
  }

  /**
   * Inicia sesión del usuario
   * @param loginRequest - Credenciales de usuario
   * @returns Observable con la respuesta de login
   */
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    // Convertir Promise de ApiService a Observable para mantener compatibilidad
    return new Observable((observer) => {
      this.api
        .post<LoginResponse>('Auth/admin/login', loginRequest)
        .then((response) => {
          this.setSession(response);
          observer.next(response);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  /**
   * Cierra sesión del usuario
   * Limpia storage y navega a login
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /**
   * Obtiene el token de autenticación actual
   * @returns Token o null si no existe
   */
  getToken(): string | null {
    return this.storage.get<string>(StorageKey.AUTH_TOKEN);
  }

  /**
   * Obtiene el usuario autenticado actual
   * @returns Usuario o null si no hay sesión
   */
  getUser(): User | null {
    return this.storage.get<User>(StorageKey.USER_DATA);
  }

  /**
   * Verifica si hay un usuario autenticado
   * @returns boolean indicando si hay sesión activa
   */
  isAuthenticated(): boolean {
    return this.storage.has(StorageKey.AUTH_TOKEN);
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * @param role - Rol a verificar
   * @returns boolean indicando si el usuario tiene ese rol
   */
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles?.includes(role) ?? false;
  }

  /**
   * Solicita recuperación de contraseña
   * @param request - Datos para recuperación
   * @returns Observable con respuesta
   */
  forgotPassword(
    request: ForgotPasswordRequest
  ): Observable<ForgotPasswordResponse> {
    return new Observable((observer) => {
      this.api
        .post<ForgotPasswordResponse>('Auth/admin/forgot-password', request)
        .then((response) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  /**
   * Resetea la contraseña del usuario
   * @param request - Datos para resetear contraseña
   * @returns Observable con respuesta
   */
  resetPassword(
    request: ResetPasswordRequest
  ): Observable<ResetPasswordResponse> {
    return new Observable((observer) => {
      this.api
        .post<ResetPasswordResponse>('Auth/admin/reset-password', request)
        .then((response) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  /**
   * Guarda la sesión completa en storage
   * @param response - Respuesta de login con token y usuario
   */
  private setSession(response: LoginResponse): void {
    this.storage.set(StorageKey.AUTH_TOKEN, response.token);
    this.storage.set(StorageKey.USER_DATA, response.user);
    this.currentUserSubject.next(response.user);
  }

  /**
   * Limpia la sesión completa del storage
   */
  private clearSession(): void {
    this.storage.clear();
    this.currentUserSubject.next(null);
  }
}
