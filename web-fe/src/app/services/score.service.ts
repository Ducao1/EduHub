import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ScoreAssignmentResponse } from '../interfaces/score';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private apiBase = `${environment.apiBaseUrl}/scores`;

  constructor(private http: HttpClient) { }

  getScoreBySubmissionId(submissionId: number): Observable<any> {
    return this.http.get(`${this.apiBase}/submissions/${submissionId}`);
  }

  gradeSubmission(scoreDTO: any): Observable<any> {
    return this.http.post(`${this.apiBase}/grade`, scoreDTO);
  }

  getScoresByAssignmentId(assignmentId: number): Observable<ScoreAssignmentResponse[]> {
    return this.http.get<ScoreAssignmentResponse[]>(`${this.apiBase}/assignments/${assignmentId}`);
  }

  getScoresByExamId(examId: number): Observable<ScoreAssignmentResponse[]> {
    return this.http.get<ScoreAssignmentResponse[]>(`${this.apiBase}/exams/${examId}`);
  }
}
