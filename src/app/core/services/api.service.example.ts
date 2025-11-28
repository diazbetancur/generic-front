/**
 * EJEMPLO DE USO DE ApiService
 *
 * Este archivo muestra cómo crear servicios que consumen APIs
 * usando el ApiService centralizado.
 */

import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

// Interfaces de ejemplo
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: string;
}

/**
 * Ejemplo de servicio de usuarios usando ApiService
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly api: ApiService) {}

  /**
   * Obtiene todos los usuarios
   * GET /users
   */
  async getUsers(): Promise<User[]> {
    return this.api.get<User[]>('users');
  }

  /**
   * Obtiene usuarios con filtros
   * GET /users?role=admin&active=true
   */
  async getUsersByRole(role: string, active: boolean = true): Promise<User[]> {
    return this.api.get<User[]>('users', {
      params: { role, active },
    });
  }

  /**
   * Obtiene un usuario por ID
   * GET /users/123
   */
  async getUserById(id: number): Promise<User> {
    return this.api.get<User>(`users/${id}`);
  }

  /**
   * Crea un nuevo usuario
   * POST /users
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    return this.api.post<User>('users', userData);
  }

  /**
   * Actualiza un usuario completamente
   * PUT /users/123
   */
  async updateUser(id: number, userData: CreateUserDto): Promise<User> {
    return this.api.put<User>(`users/${id}`, userData);
  }

  /**
   * Actualiza un usuario parcialmente
   * PATCH /users/123
   */
  async patchUser(id: number, userData: UpdateUserDto): Promise<User> {
    return this.api.patch<User>(`users/${id}`, userData);
  }

  /**
   * Elimina un usuario
   * DELETE /users/123
   */
  async deleteUser(id: number): Promise<void> {
    return this.api.delete<void>(`users/${id}`);
  }

  /**
   * Ejemplo con headers personalizados
   */
  async getUsersWithCustomHeaders(): Promise<User[]> {
    return this.api.get<User[]>('users', {
      headers: {
        'X-Custom-Header': 'custom-value',
      },
    });
  }

  /**
   * Ejemplo de descarga de archivo
   */
  async downloadUserReport(userId: number): Promise<Blob> {
    return this.api.get<Blob>(`users/${userId}/report`, {
      responseType: 'blob',
    });
  }
}

/**
 * NOTAS IMPORTANTES:
 *
 * 1. Rutas Relativas:
 *    - Usa 'users' en lugar de `${environment.apiUrl}/users`
 *    - El BaseUrlInterceptor agrega automáticamente la URL base
 *
 * 2. Autenticación:
 *    - NO necesitas agregar manualmente el token
 *    - El AuthInterceptor lo agrega automáticamente en cada petición
 *
 * 3. Loading:
 *    - NO necesitas mostrar/ocultar loading manualmente
 *    - El LoadingInterceptor maneja el estado de carga global
 *
 * 4. Manejo de Errores:
 *    - El ErrorInterceptor maneja errores HTTP globalmente
 *    - Puedes agregar manejo específico con try/catch si lo necesitas
 *
 * 5. Logging:
 *    - ApiService automáticamente logea todas las peticiones
 *    - En desarrollo: logs completos
 *    - En producción: solo errores
 *
 * 6. Promises vs Observables:
 *    - ApiService usa Promises para simplicidad
 *    - Si necesitas Observables, puedes convertir con `from(promise)`
 *
 * 7. Type Safety:
 *    - Siempre especifica el tipo genérico: `api.get<User[]>(...)`
 *    - Evita `any` tipos
 */

/**
 * EJEMPLO DE USO EN COMPONENTES:
 */

// import { Component, OnInit } from '@angular/core';
// import { UserService } from '../services/user.service';
//
// @Component({
//   selector: 'app-users',
//   templateUrl: './users.component.html',
// })
// export class UsersComponent implements OnInit {
//   users: User[] = [];
//   loading = false;
//
//   constructor(private userService: UserService) {}
//
//   async ngOnInit() {
//     await this.loadUsers();
//   }
//
//   async loadUsers() {
//     try {
//       this.loading = true;
//       this.users = await this.userService.getUsers();
//     } catch (error) {
//       console.error('Error loading users:', error);
//       // El ErrorInterceptor ya manejó el error globalmente
//     } finally {
//       this.loading = false;
//     }
//   }
//
//   async createUser() {
//     try {
//       const newUser = await this.userService.createUser({
//         name: 'John Doe',
//         email: 'john@example.com',
//         password: 'secure123',
//         role: 'user',
//       });
//       this.users.push(newUser);
//     } catch (error) {
//       // Manejo específico si es necesario
//     }
//   }
// }
