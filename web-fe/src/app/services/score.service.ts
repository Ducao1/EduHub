import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ScoreAssignmentResponse, ScoreExamResponse } from '../interfaces/score';

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

  getScoresByExamId(examId: number): Observable<ScoreExamResponse[]> {
    return this.http.get<ScoreExamResponse[]>(`${this.apiBase}/exams/${examId}`);
  }

  getAssignmentScoresByStudentId(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/assignments/student/${studentId}`);
  }

  getExamScoresByStudentId(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/exams/student/${studentId}`);
  }

  exportAssignmentScoresToExcel(assignmentId: number) {
    return this.http.get(`${this.apiBase}/assignments/${assignmentId}/export`, { responseType: 'blob' });
  }

  exportExamScoresToExcel(examId: number) {
    return this.http.get(`${this.apiBase}/exams/${examId}/export`, { responseType: 'blob' });
  }

  exportStudentScoresByClassId(classId: number) {
    return this.http.get(`${this.apiBase}/class/${classId}/students-scores/export`, { responseType: 'blob' });
  }
}
