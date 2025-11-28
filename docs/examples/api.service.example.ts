/**
 * EJEMPLO DE USO DE ApiService (movido a docs/examples)
 * Mantiene exactamente la misma referencia pero fuera del árbol de core.
 */

import { Injectable } from '@angular/core';
import { ApiService } from '../../src/app/core/services/api.service';

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

@Injectable({ providedIn: 'root' })
export class UserServiceExample {
  constructor(private readonly api: ApiService) {}

  async getUsers(): Promise<User[]> {
    return this.api.get<User[]>('users');
  }
}
