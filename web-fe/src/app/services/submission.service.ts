import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { SubmissionExamDTO } from '../dtos/submission-exam.dto';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  private apiSubmitAssignment = `${environment.apiBaseUrl}/submissions/assignment`;
  private apiSubmitExam = `${environment.apiBaseUrl}/submissions/submit-exam`;

  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }

  private getApiConfig() {
    return {
      headers: this.httpUtilService.createHeaders(),
    };
  }


  submitAssignment(studentId: number, assignmentId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('studentId', studentId.toString());
    formData.append('assignmentId', assignmentId.toString());
    formData.append('file', file);

    return this.http.post(this.apiSubmitAssignment, formData, {
      headers: new HttpHeaders({ 'Accept': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Lỗi không xác định!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Lỗi phía client: ${error.error.message}`;
    } else if (error.status === 400) {
      errorMessage = 'Lỗi 400: Dữ liệu gửi lên không hợp lệ!';
    } else if (error.status === 413) {
      errorMessage = 'Lỗi 413: File quá lớn (Giới hạn 5MB)!';
    } else if (error.status === 500) {
      errorMessage = 'Lỗi 500: Lỗi từ server!';
    }
    console.error('Chi tiết lỗi:', error);
    return throwError(() => new Error(errorMessage));
  }

  getStudentSubmissionStatus(userId: number, assignmentId: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/submissions/status/${userId}/${assignmentId}`);
  }

  getClassSubmissionStatus(classId: number, assignmentId: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/submissions/status/class/${classId}/assignment/${assignmentId}`);
  }

  cancelSubmission(userId: number, assignmentId: number): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/cancel/${userId}/${assignmentId}`);
  }

  submitExam(submissionExamDTO: SubmissionExamDTO): Observable<any> {
    return this.http.post(this.apiSubmitExam, submissionExamDTO, this.getApiConfig());
  }
  getSubmissionById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/submissions/${id}`, this.getApiConfig());
  }
  getAllSubmissionByExamId(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/submissions/exam/${id}`);
  }
}
