import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilService } from './http.util.service';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AnswerDTO } from '../dtos/answer.dto';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private apiAddAnswers = `${environment.apiBaseUrl}/answers/add`;

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }

  private getApiConfig() {
    return {
      headers: this.httpUtilService.createHeaders(),
    };
  }

  addAnswers(answers: AnswerDTO[]): Observable<any> {
    return this.http.post(this.apiAddAnswers, answers, this.getApiConfig());
  }
}
