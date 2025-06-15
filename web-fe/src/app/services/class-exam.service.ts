import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { AssignExamDTO } from '../dtos/requests/assign-exam.dto';
import { JoinClassDTO } from '../dtos/requests/join-class.dto';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassExamService {

  private apiAssignExam = `${environment.apiBaseUrl}/class/exams/add`;

  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }

  private getApiConfig() {
    return {
      headers: this.httpUtilService.createHeaders(),
      withCredentials: true
    };
  }

  getExamByClass(classId: number, page: number, size: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/class/exams/${classId}?page=${page}&size=${size}`);
  }

  assignExamtoClass(assignExamDTO: AssignExamDTO): Observable<any> {
    return this.http.post(this.apiAssignExam, assignExamDTO, this.getApiConfig());
  }
}
