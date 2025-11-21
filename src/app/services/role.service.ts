import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role, RoleRequest } from '../interfaces/role.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/admin/Roles`);
  }

  getRoleById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/admin/Roles/${id}`);
  }

  createRole(role: RoleRequest): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/admin/Roles`, role);
  }

  updateRole(role: RoleRequest): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/admin/Roles`, role);
  }

  deleteRole(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/Roles/${id}`);
  }
}

