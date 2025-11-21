import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { State, StateRequest } from '../interfaces/state.interface';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(`${this.apiUrl}/State`);
  }

  getStateById(id: string): Observable<State> {
    return this.http.get<State>(`${this.apiUrl}/State/${id}`);
  }

  createState(state: StateRequest): Observable<State> {
    return this.http.post<State>(`${this.apiUrl}/State`, state);
  }

  updateState(state: StateRequest): Observable<State> {
    return this.http.put<State>(`${this.apiUrl}/State`, state);
  }

  deleteState(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/State/${id}`);
  }
}

