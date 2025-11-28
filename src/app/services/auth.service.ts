import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
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
  /** Signals internos */
  private readonly storage = inject(StorageService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly _user = signal<User | null>(
    this.storage.get<User>(StorageKey.USER_DATA)
  );
  private readonly _token = signal<string | null>(
    this.storage.get<string>(StorageKey.AUTH_TOKEN)
  );

  /** Computeds públicos */
  public readonly user = computed(() => this._user());
  public readonly token = computed(() => this._token());
  public readonly isAuthenticatedSignal = computed(() => !!this._token());

  constructor() {
    // Efecto para sincronizar storage ante cambios de token/usuario
    effect(() => {
      const token = this._token();
      const user = this._user();
      if (token) {
        this.storage.set(StorageKey.AUTH_TOKEN, token);
      } else {
        this.storage.remove(StorageKey.AUTH_TOKEN);
      }
      if (user) {
        this.storage.set(StorageKey.USER_DATA, user);
      } else {
        this.storage.remove(StorageKey.USER_DATA);
      }
    });
  }

  /** Login usando async/await */
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      'Auth/admin/login',
      loginRequest
    );
    this._token.set(response.token);
    this._user.set(response.user);
    return response;
  }

  /** Logout limpiando signals y storage */
  logout(): void {
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  /** Utilidades de acceso */
  getToken(): string | null {
    return this._token();
  }

  getUser(): User | null {
    return this._user();
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSignal();
  }

  hasRole(role: string): boolean {
    const user = this._user();
    return user?.roles?.includes(role) ?? false;
  }

  /** Flujos adicionales convertidos a Promises para consistencia */
  async forgotPassword(
    request: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    return this.api.post<ForgotPasswordResponse>(
      'Auth/admin/forgot-password',
      request
    );
  }

  async resetPassword(
    request: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    return this.api.post<ResetPasswordResponse>(
      'Auth/admin/reset-password',
      request
    );
  }
}
