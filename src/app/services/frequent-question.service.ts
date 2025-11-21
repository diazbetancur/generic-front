import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FrequentQuestion, FrequentQuestionRequest } from '../interfaces/frequent-question.interface';

@Injectable({
  providedIn: 'root'
})
export class FrequentQuestionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getFrequentQuestions(): Observable<FrequentQuestion[]> {
    return this.http.get<FrequentQuestion[]>(`${this.apiUrl}/FrequentQuestions`);
  }

  getFrequentQuestionById(id: string): Observable<FrequentQuestion> {
    return this.http.get<FrequentQuestion>(`${this.apiUrl}/FrequentQuestions/${id}`);
  }

  createFrequentQuestion(frequentQuestion: FrequentQuestionRequest): Observable<FrequentQuestion> {
    return this.http.post<FrequentQuestion>(`${this.apiUrl}/FrequentQuestions`, frequentQuestion);
  }

  updateFrequentQuestion(frequentQuestion: FrequentQuestionRequest): Observable<FrequentQuestion> {
    return this.http.put<FrequentQuestion>(`${this.apiUrl}/FrequentQuestions`, frequentQuestion);
  }

  deleteFrequentQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/FrequentQuestions/${id}`);
  }
}

