import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilService } from './http.util.service';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { QuestionDTO } from '../dtos/requests/question.dto';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiAddQuestion = `${environment.apiBaseUrl}/questions/add`;
  
  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }

  private getApiConfig() {
    return {
      headers: this.httpUtilService.createHeaders(),
    };
  }

  addQuestion(questionDTO: QuestionDTO): Observable<any> {
    return this.http.post(this.apiAddQuestion, questionDTO, this.getApiConfig());
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/questions/${id}`);
  }
  
  getQuestionById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/questions/${id}`);
  }

  updateQuestion(id: number, questionDTO: QuestionDTO): Observable<any> {
    return this.http.put(`${environment.apiBaseUrl}/questions/${id}`, questionDTO);
  }
}
