import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { ExamDTO } from '../dtos/requests/exam.dto';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiAddExam = `${environment.apiBaseUrl}/exams/add`;
  private apiAssignExam = `${environment.apiBaseUrl}/exams/assign`;

  constructor(private http: HttpClient, private httpUtilService: HttpUtilService) {}

  private getApiConfig() {
    return {
      headers: this.httpUtilService.createHeaders(),
    };
  }

  getExams(teacherId: number, page: number = 0, size: number = 9, searchTerm: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get(`${environment.apiBaseUrl}/exams/teacher/${teacherId}`, { params });
  }

  addExam(examDTO: ExamDTO): Observable<any> {
    return this.http.post(this.apiAddExam, examDTO, this.getApiConfig());
  }

  getExamById(id: number, params?: { classId?: number }): Observable<any> {
    let httpParams = new HttpParams();
    if (params?.classId) {
      httpParams = httpParams.set('classId', params.classId.toString());
    }
    return this.http.get<any>(`${environment.apiBaseUrl}/exams/${id}`, { params: httpParams });
  }

  deleteExamById(id: number): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/exams/${id}`);
  }

  getExamsByClassId(classId: number, page: number = 0, size: number = 100, searchTerm: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get(`${environment.apiBaseUrl}/exams/class/${classId}`, { params });
  }
}