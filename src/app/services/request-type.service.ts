import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RequestType, RequestTypeRequest } from '../interfaces/request-type.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestTypeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRequestTypes(): Observable<RequestType[]> {
    return this.http.get<RequestType[]>(`${this.apiUrl}/RequestType`);
  }

  getRequestTypeById(id: string): Observable<RequestType> {
    return this.http.get<RequestType>(`${this.apiUrl}/RequestType/${id}`);
  }

  createRequestType(requestType: RequestTypeRequest): Observable<RequestType> {
    return this.http.post<RequestType>(`${this.apiUrl}/RequestType`, requestType);
  }

  updateRequestType(requestType: RequestTypeRequest): Observable<RequestType> {
    return this.http.put<RequestType>(`${this.apiUrl}/RequestType`, requestType);
  }

  deleteRequestType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/RequestType/${id}`);
  }
}

